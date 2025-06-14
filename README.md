# Contessa Boilerplates

A package that provides ready-to-use React boilerplates, installable directly in your project.

## Installation

```bash
npm install github:Contessafry/contessa-boilerplates
```

or

```bash
yarn add github:Contessafry/contessa-boilerplates
```

## Usage

After installation, the code will be copied to the `src/contessa` folder of your project.

### useStoredState Hook

A React hook for managing persistent state in localStorage or sessionStorage.

```typescript
import { useStoredState } from "src/contessa/hooks/useStoredState";

// Usage example
const [value, setValue, removeValue] = useStoredState({
  key: "my-key",
  value: "default value",
  type: "local", // or 'session'
});
```

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`

## License

MIT
