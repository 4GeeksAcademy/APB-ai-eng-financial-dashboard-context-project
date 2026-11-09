import random
from datetime import date

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.routes import (
    FinancialMovement,
    MetricsSummaryItem,
    detect_outcome_alerts,
    filter_movements_by_date,
    generate_mock_movements,
)


client = TestClient(app)


def test_generate_mock_movements_returns_full_year_sorted_data():
    movements = generate_mock_movements(seed=42)

    assert len(movements) == 360
    assert movements == sorted(movements, key=lambda item: item.create_date)


def test_generate_mock_movements_does_not_change_global_random_state():
    state = random.getstate()

    generate_mock_movements(seed=42)

    assert random.getstate() == state


def test_generate_mock_movements_cache_does_not_share_mutable_models():
    first = generate_mock_movements(seed=42)
    original_amount = first[0].amount
    first[0].amount = 0

    second = generate_mock_movements(seed=42)

    assert second[0].amount == original_amount
    assert first is not second


def test_filter_movements_by_date_includes_range_edges():
    movements = generate_mock_movements(seed=42)
    target_date = movements[0].create_date

    filtered = filter_movements_by_date(movements, target_date, target_date)

    assert filtered
    assert all(movement.create_date == target_date for movement in filtered)


def test_health_endpoint_returns_ok():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_metrics_endpoint_respects_date_filters():
    base_response = client.get("/api/metrics")
    assert base_response.status_code == 200
    first_date = base_response.json()[0]["create_date"]

    response = client.get(
        "/api/metrics",
        params={"start_date": first_date, "end_date": first_date},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload
    assert all(item["create_date"] == first_date for item in payload)


def test_b2b_endpoint_only_returns_b2b_records():
    response = client.get("/api/metrics/b2b")

    assert response.status_code == 200
    payload = response.json()
    assert payload
    assert all(item["business_type"] == "B2B" for item in payload)
    assert payload == sorted(payload, key=lambda item: item["create_date"])


def test_b2c_endpoint_only_returns_b2c_records():
    response = client.get("/api/metrics/b2c")

    assert response.status_code == 200
    payload = response.json()
    assert payload
    assert all(item["business_type"] == "B2C" for item in payload)
    assert payload == sorted(payload, key=lambda item: item["create_date"])


def test_metrics_endpoint_filters_by_category():
    response = client.get("/api/metrics", params={"category": "sales"})

    assert response.status_code == 200
    payload = response.json()
    assert payload
    assert all(item["category"] == "sales" for item in payload)


def test_metrics_endpoint_filters_by_operation_type():
    response = client.get("/api/metrics", params={"operation_type": "income"})

    assert response.status_code == 200
    payload = response.json()
    assert payload
    assert all(item["operation_type"] == "income" for item in payload)


def test_b2b_endpoint_combines_new_filters():
    response = client.get(
        "/api/metrics/b2b",
        params={"operation_type": "outcome", "category": "suppliers"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload
    assert all(item["business_type"] == "B2B" for item in payload)
    assert all(item["operation_type"] == "outcome" for item in payload)
    assert all(item["category"] == "suppliers" for item in payload)


def test_metrics_facets_returns_filter_options_and_date_range():
    response = client.get("/api/metrics/facets")

    assert response.status_code == 200
    payload = response.json()
    assert sorted(payload["operation_types"]) == ["income", "outcome"]
    assert payload["business_types"] == ["B2B", "B2C"]
    assert payload["categories"] == [
        "administrative",
        "operational",
        "others",
        "sales",
        "suppliers",
    ]
    assert payload["min_date"] <= payload["max_date"]


def test_metrics_summary_by_month_returns_balances():
    response = client.get("/api/metrics/summary", params={"group_by": "month"})

    assert response.status_code == 200
    payload = response.json()
    assert payload
    first = payload[0]
    assert set(first.keys()) == {"period", "income", "outcome", "net"}
    assert all(item["income"] >= 0 for item in payload)
    assert all(item["outcome"] >= 0 for item in payload)


def test_metrics_summary_by_week_honors_business_type_filter():
    response = client.get(
        "/api/metrics/summary",
        params={"group_by": "week", "business_type": "B2C"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload


def test_top_categories_returns_limited_sorted_categories():
    response = client.get(
        "/api/metrics/categories/top",
        params={"operation_type": "outcome", "limit": 3},
    )

    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 3
    assert payload[0]["total_amount"] >= payload[1]["total_amount"]
    assert all(item["operation_type"] == "outcome" for item in payload)


def test_metrics_comparison_returns_delta_fields():
    response = client.get(
        "/api/metrics/comparison",
        params={"start_date": "2025-03-01", "end_date": "2025-03-31"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert set(payload.keys()) == {
        "current_period",
        "previous_period",
        "delta_abs",
        "delta_pct",
    }


def test_metrics_alerts_returns_anomaly_candidates():
    response = client.get(
        "/api/metrics/alerts",
        params={"threshold": 0.2, "group_by": "month"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert isinstance(payload, list)
    if payload:
        first = payload[0]
        assert set(first.keys()) == {
            "period",
            "outcome_total",
            "baseline_average",
            "increase_ratio",
        }


@pytest.fixture
def alert_dataset(monkeypatch):
    movements = [
        FinancialMovement(
            create_date=movement_date,
            amount=amount,
            operation_type="outcome",
            category="operational",
            business_type="B2B",
        )
        for movement_date, amount in [
            (date(2025, 11, 15), 1000),
            (date(2025, 12, 15), 90),
            (date(2026, 1, 15), 100),
            (date(2026, 2, 15), 110),
            (date(2026, 3, 15), 140),
        ]
    ]
    monkeypatch.setattr("app.routes.generate_mock_movements", lambda seed=None: movements)
    return movements


def test_metrics_alerts_uses_only_three_previous_months(alert_dataset):
    response = client.get("/api/metrics/alerts")

    assert response.status_code == 200
    assert response.json() == [{
        "period": "2026-03",
        "outcome_total": 140.0,
        "baseline_average": 100.0,
        "increase_ratio": 0.4,
    }]


@pytest.mark.parametrize("dates", [
    {"start_date": "2026-03-01", "end_date": "2026-03-31"},
    {"start_date": "2026-03-01"},
    {"end_date": "2026-03-31"},
    {"start_date": "2026-03-15", "end_date": "2026-03-15"},
])
def test_metrics_alerts_keeps_reference_outside_date_filter(alert_dataset, dates):
    response = client.get("/api/metrics/alerts", params=dates)

    assert response.status_code == 200
    assert response.json() == client.get("/api/metrics/alerts").json()


def test_metrics_alerts_filters_target_movements_by_exact_dates(alert_dataset):
    response = client.get("/api/metrics/alerts", params={"end_date": "2026-03-14"})

    assert response.status_code == 200
    assert response.json() == []


def test_metrics_alerts_requires_three_consecutive_previous_months(alert_dataset):
    alert_dataset[:] = [
        movement for movement in alert_dataset
        if movement.create_date != date(2026, 1, 15)
    ]

    assert client.get("/api/metrics/alerts").json() == []


def test_metrics_alerts_does_not_evaluate_first_three_months():
    summary = [
        MetricsSummaryItem(
            period=f"2026-{month:02d}", income=0, outcome=amount, net=-amount
        )
        for month, amount in enumerate((90, 100, 140), 1)
    ]

    assert detect_outcome_alerts(summary, 0.1) == []


@pytest.mark.parametrize("threshold, status", [
    (0.09, 422), (0.1, 200), (0.3, 200), (1.0, 200), (1.01, 422),
])
def test_metrics_alerts_validates_threshold_limits(alert_dataset, threshold, status):
    response = client.get("/api/metrics/alerts", params={"threshold": threshold})

    assert response.status_code == status


def test_metrics_alerts_default_and_changed_threshold(alert_dataset):
    assert client.get("/api/metrics/alerts").json() == client.get(
        "/api/metrics/alerts", params={"threshold": 0.3}
    ).json()
    assert client.get("/api/metrics/alerts", params={"threshold": 0.5}).json() == []


def test_metrics_alerts_does_not_alert_when_increment_equals_threshold(alert_dataset):
    alert_dataset[-1].amount = 130

    assert client.get("/api/metrics/alerts", params={"threshold": 0.3}).json() == []


@pytest.mark.parametrize("group_by, periods", [
    ("day", ["2026-01-01", "2026-01-02"]),
    ("week", ["2026-W01", "2026-W02"]),
])
def test_metrics_alerts_preserves_other_groupings(group_by, periods):
    summary = [
        MetricsSummaryItem(period=period, income=0, outcome=amount, net=-amount)
        for period, amount in zip(periods, (100, 140))
    ]

    assert detect_outcome_alerts(summary, 0.3, group_by)[0].increase_ratio == 0.4
