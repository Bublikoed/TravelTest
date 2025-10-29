# withLoader HOC

HOC для автоматичного відстеження стану завантаження React Query запитів.

## Використання

### Базове використання

```typescript
export default withLoader(MyComponent);
```

### З ігноруванням певних запитів

```typescript
export default withLoader(MyComponent, {
    ignoreQueries: ['searchGeo', 'userProfile'], // Ігнорує запити, що містять ці ключі
});
```

### З ігноруванням за регулярними виразами

```typescript
export default withLoader(MyComponent, {
    ignoreQueryPatterns: [
        /^search/, // Ігнорує всі запити, що починаються з "search"
        /.*Geo.*/, // Ігнорує всі запити, що містять "Geo"
    ],
});
```

### Комбіноване ігнорування

```typescript
export default withLoader(MyComponent, {
    ignoreQueries: ['searchGeo'],
    ignoreQueryPatterns: [/^search/, /.*Geo.*/],
});
```

## Опції

-   `ignoreQueries?: string[]` - Масив ключів запитів для ігнорування
-   `ignoreQueryPatterns?: RegExp[]` - Масив регулярних виразів для ігнорування запитів

## Приклади

### Ігнорування пошукових запитів

```typescript
export default withLoader(SearchPage, {
    ignoreQueries: ['searchGeo', 'searchHotels'],
});
```

### Ігнорування всіх запитів пошуку

```typescript
export default withLoader(SearchPage, {
    ignoreQueryPatterns: [/^search/],
});
```

### Ігнорування запитів автодоповнення

```typescript
export default withLoader(AutoCompletePage, {
    ignoreQueryPatterns: [/.*AutoComplete.*/, /.*Suggestion.*/],
});
```
