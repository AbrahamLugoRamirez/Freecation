# Freecation · Colombia

Aplicación en React que te dice en qué fechas del año tomar tus días de vacaciones
para obtener la mayor cantidad de días libres seguidos, aprovechando fines de semana
y puentes festivos de Colombia.

## Uso

```bash
npm install
npm run dev
```

1. Indica cuántos días hábiles de vacaciones quieres tomar.
2. Marca qué días de la semana trabajas.
3. Elige el año. La app muestra las 10 mejores ventanas (sin superponerse) y las resalta en el calendario.

## Cómo funciona

- **Festivos** (`src/lib/holidays.ts`): se calculan para cualquier año según la Ley 51 de 1983
  (Ley Emiliani), incluyendo los que dependen de la Semana Santa (algoritmo de Pascua).
- **Optimizador** (`src/lib/optimizer.ts`): para cada día hábil posible como inicio, gasta los N días
  hábiles y extiende el bloque con los días libres que lo rodean. Ordena por total de días libres.
