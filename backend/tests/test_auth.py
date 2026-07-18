def test_register_user(client):
    response = client.post(
        "/api/auth/register",
        json={"username": "testuser", "password": "testpassword123"}
    )
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"
    assert "id" in response.json()

def test_register_user_duplicate(client):
    # Try registering the same user again
    response = client.post(
        "/api/auth/register",
        json={"username": "testuser", "password": "testpassword123"}
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()

def test_login_success(client):
    response = client.post(
        "/api/auth/login",
        json={"username": "testuser", "password": "testpassword123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_invalid_password(client):
    response = client.post(
        "/api/auth/login",
        json={"username": "testuser", "password": "wrongpassword"}
    )
    assert response.status_code == 400
    assert "incorrect" in response.json()["detail"].lower()
