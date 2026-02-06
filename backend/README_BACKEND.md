Django backend scaffold created by assistant.

Next steps (on your machine):

1. Create & activate virtualenv:
   python -m venv .venv
   source .venv/bin/activate   # on Windows use .venv\Scripts\activate

2. Install dependencies:
   pip install django djangorestframework django-cors-headers pillow

3. From this backend directory run migrations:
   cd backend
   python manage.py makemigrations
   python manage.py migrate

4. Create superuser:
   python manage.py createsuperuser

5. Run server:
   python manage.py runserver

API endpoints:
  GET  /api/properties/
  GET  /api/properties/<pk>/
  GET  /api/properties/featured/
  GET  /api/areas/

Place media uploads into media/property_images/ or use admin to add properties and images.

NOTE: For production change SECRET_KEY, DEBUG=False, configure ALLOWED_HOSTS and use a proper DB and media storage.
