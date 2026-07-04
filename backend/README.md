# HomeNest Backend

FastAPI application for managing family digital command center features.

## Setup Instructions

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv .venv
   ```

3. Activate virtual environment:
   - Windows: `.venv\Scripts\activate`
   - macOS/Linux: `source .venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```

6. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
