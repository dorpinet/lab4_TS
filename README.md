# Практична робота № 4
Варіант: 2
Тема: розроблення REST-ендпоінтів засобами NestJS.

Опис: REST API для ресурсу `/books` (книжковий онлайн-магазин) з повним CRUD, типізованими DTO, обробкою HTTP-виключень та in-memory сервісом.


## Встановлення та запуск

```bash
git clone <лінк на репозиторій>
cd online-store
npm install
npm run start:dev
```

Сервер запускається за адресою: http://localhost:3000

Перевірка збірки без помилок:

```bash
npm run build
```

## Як створено проєкт

```bash
npx @nestjs/cli new online-store --strict --package-manager npm
npx @nestjs/cli g co books --no-spec
npx @nestjs/cli g s books --no-spec
npm i class-validator class-transformer @nestjs/mapped-types
```

## Структура

```
src/
├── main.ts                  # точка входу, глобальний ValidationPipe
├── app.module.ts            # кореневий модуль
└── books/
    ├── books.controller.ts  # маршрути та HTTP-статуси
    ├── books.service.ts     # in-memory сховище та бізнес-логіка
    ├── dto/
    │   ├── create-book.dto.ts
    │   └── update-book.dto.ts
    └── entities/
        └── book.entity.ts
```

## Сутність Book

| Поле | Тип | Опис |
|---|---|---|
| id | string | генерується автоматично (UUID) |
| title | string | назва книги |
| price | number | ціна, додатне число |
| isbn | string | коректний ISBN-10 / ISBN-13, унікальний |
| pageCount | integer | кількість сторінок, мінімум 1 |
| author | string | автор |

## Ендпоінти

| Метод | Шлях | Опис | Статуси |
|---|---|---|---|
| GET | /books | отримати всі книги | 200 |
| GET | /books/:id | отримати книгу за id | 200, 404 |
| POST | /books | створити книгу | 201, 400, 409 |
| PATCH | /books/:id | часткове оновлення | 200, 400, 404, 409 |
| DELETE | /books/:id | видалити книгу | 204, 404 |

## Реалізація

**Рівень 1:**
- створено проєкт за допомогою Nest CLI та згенеровано контролер `books`, який автоматично зареєстровано в `AppModule`;
- створено DTO-класи `CreateBookDto` (обов'язкові поля) та `UpdateBookDto` (усі поля опціональні);
- реалізовано `@Get()`, `@Get(':id')` (`@Param`), `@Post()` (`@Body`).

**Рівень 2:**
- створено `BooksService` (`@Injectable`) з приватним in-memory сховищем та 3 початковими записами;
- методи сервісу: `findAll`, `findOne`, `create`, `update`, `remove`;
- якщо запис не знайдено, кидається `NotFoundException` (404);
- сервіс впроваджено в контролер через конструктор (Dependency Injection), контролер лише делегує виклики сервісу;
- `@Post()` повертає `201 Created` (`@HttpCode(HttpStatus.CREATED)`);
- `@Delete(':id')` повертає `204 No Content` (`@HttpCode(HttpStatus.NO_CONTENT)`);
- `@Patch(':id')` оновлює лише передані поля.

**Додатково:**
- глобальний `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`), некоректні дані та зайві поля дають 400;
- перевірка унікальності ISBN, дублікат дає `ConflictException` (409).

## Скріншоти

### Створення проєкту через Nest CLI

![Створення проєкту](docs/Screenshot%202026-10-28%20153212.png)

### Запуск сервера: 0 помилок, усі маршрути зареєстровано

![Запуск сервера](docs/Screenshot%202026-10-28%20160441.png)

# Висновки
Було досліджено архітектуру NestJS: модульну організацію, роль кореневого модуля AppModule, точки входу main.ts та принцип інверсії керування (IoC). За допомогою @nestjs/cli створено проєкт і згенеровано контролер та сервіс, які автоматично зареєструвались у AppModule.
