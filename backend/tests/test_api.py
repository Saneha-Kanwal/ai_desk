import pytest
from fastapi.testclient import TestClient


def test_health_check(client: TestClient):
    """Test health check endpoint"""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_list_news_empty(client: TestClient):
    """Test listing news when database is empty"""
    response = client.get("/api/news")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] == 0


def test_list_news_with_pagination(client: TestClient):
    """Test news listing with pagination"""
    response = client.get("/api/news?page=1&page_size=10")
    assert response.status_code == 200
    data = response.json()
    assert "page" in data
    assert "page_size" in data
    assert "has_more" in data


def test_get_nonexistent_news_item(client: TestClient):
    """Test getting a non-existent news item"""
    import uuid
    fake_id = uuid.uuid4()
    response = client.get(f"/api/news/{fake_id}")
    assert response.status_code == 404


def test_admin_seed_without_token(client: TestClient):
    """Test admin seed endpoint without token"""
    response = client.post("/admin/seed")
    assert response.status_code == 401


def test_admin_seed_with_invalid_token(client: TestClient):
    """Test admin seed endpoint with invalid token"""
    response = client.post(
        "/admin/seed",
        headers={"Authorization": "Bearer invalid-token"}
    )
    assert response.status_code == 403

