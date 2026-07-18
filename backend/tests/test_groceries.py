import pytest

@pytest.fixture(scope="module")
def auth_headers(client):
    # Register and login to get headers
    client.post(
        "/api/auth/register",
        json={"username": "groceryuser", "password": "password123"}
    )
    response = client.post(
        "/api/auth/login",
        json={"username": "groceryuser", "password": "password123"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_create_grocery_item(client, auth_headers):
    response = client.post(
        "/api/groceries",
        json={"item_name": "Milk", "quantity": 2, "unit": "liters", "category": "Dairy"},
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["data"]["item_name"] == "Milk"
    assert response.json()["data"]["is_completed"] is False

def test_get_groceries_list(client, auth_headers):
    response = client.get(
        "/api/groceries",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["success"] is True
    data = response.json()["data"]
    assert len(data) >= 1
    assert data[0]["item_name"] == "Milk"

def test_toggle_grocery_item(client, auth_headers):
    # Fetch list to get ID
    items = client.get("/api/groceries", headers=auth_headers).json()["data"]
    item_id = items[0]["id"]

    # Toggle completion status
    response = client.put(
        f"/api/groceries/{item_id}",
        json={"is_completed": True},
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["data"]["is_completed"] is True

def test_delete_grocery_item(client, auth_headers):
    items = client.get("/api/groceries", headers=auth_headers).json()["data"]
    item_id = items[0]["id"]

    # Delete the item
    response = client.delete(
        f"/api/groceries/{item_id}",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["success"] is True
