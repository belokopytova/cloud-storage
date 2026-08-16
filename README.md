# MyCloud

Облачное хранилище файлов с поддержкой Django backend и React frontend.


<details>
<summary><b>Структура проекта</b></summary>

```
cloud-storage/
├── backend/                    # Django приложение
│   ├── manage.py              # Django CLI
│   ├── requirements.txt        # Python зависимости
│   ├── apps/
│   │   ├── storage/           # Приложение для работы с файлами
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   ├── admin.py
│   │   │   └── migrations/
│   │   └── users/             # Приложение для работы с пользователями
│   │       ├── models.py
│   │       ├── views.py
│   │       ├── serializers.py
│   │       ├── permissions.py
│   │       ├── urls.py
│   │       ├── admin.py
│   │       └── migrations/
│   ├── config/                # Конфигурация Django
│   │   ├── settings.py        # Основные настройки
│   │   ├── urls.py            # Главные URL маршруты
│   │   ├── asgi.py
│   │   └── wsgi.py
│   └── core/                  # Общие утилиты
│       └── validators.py
│
└── frontend/                  # React приложение (Vite)
    ├── package.json           # Node.js зависимости
    ├── vite.config.js        # Конфигурация Vite
    ├── eslint.config.js      # ESLint конфигурация
    ├── index.html            # HTML шаблон
    ├── public/               # Статические файлы
    └── src/
        ├── App.jsx           # Главный компонент
        ├── main.jsx          # Точка входа
        ├── api/              # API клиент
        ├── components/       # React компоненты
        │   ├── admin/        # Компоненты админ-панели
        │   ├── auth/         # Компоненты аутентификации
        │   ├── common/       # Общие компоненты
        │   └── files/        # Компоненты для работы с файлами
        ├── pages/            # Страницы приложения
        ├── store/            # Redux store
        ├── styles/           # Стили
        └── assets/           # Изображения и другие ассеты
```

</details>

## Требования

- **Python 3.8+** для backend
- **Node.js 14+** и **npm** для frontend
- **PostgreSQL 12+** для базы данных



## Установка и запуск Backend (Django + PostgreSQL)

Создайте файл `.env` в папке `backend/`
Скопировать переменные из файла примера `.env.example` в папке  `backend/`

Значения `DB_NAME`, `DB_USER` и `DB_PASSWORD` должны строго совпадать с теми, которые будут использоваться при создании Базы Данных

### 1. Создание базы данных
```bash
# Подключитесь к PostgreSQL
psql -U postgres


# Создайте базу данных
CREATE DATABASE cloud_storage;


# Создайте пользователя (если нужно)
CREATE USER cloud_user WITH PASSWORD 'your_password';
```


### 2. Установка зависимостей backend

```bash
# Перейдите в папку backend
cd backend

# Создайте виртуальное окружение
python -m venv venv

# Активируйте виртуальное окружение
# На Windows:
venv\Scripts\activate
# На Linux/macOS:
source venv/bin/activate

# Установите зависимости
pip install -r requirements.txt
```

### 3. Миграция базы данных

```bash
# Примените миграции
python manage.py migrate

# Создайте суперпользователя для админ-панели
python manage.py createsuperuser
```

### 4. Запуск backend сервера

```bash
# Убедитесь, что вы в папке backend и виртуальное окружение активировано
python manage.py runserver
```

Сервер запустится на `http://localhost:8000/`

## Установка и запуск Frontend (React + Vite)

Создайте файл `.env` в папке `frontend/`
Скопировать переменные из файла примера `.env.example` в папке  `frontend/`

### 1. Установка зависимостей

```bash
# Перейдите в папку frontend
cd frontend


npm install
```

### 2. Запуск development сервера

```bash
npm run dev
```

Development сервер запустится на `http://localhost:5173/` (или другой порт, указанный в консоли)

### 3. Сборка

```bash
npm run build
```


## API документация

Backend API доступен на:

- **Swagger**: `http://localhost:8000/api/v1/docs/`


