# planit-login



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute             | Description | Type     | Default           |
| ------------------- | --------------------- | ----------- | -------- | ----------------- |
| `labelEmailAddress` | `label-email-address` |             | `string` | `"Email Address"` |
| `labelPassword`     | `label-password`      |             | `string` | `"Password"`      |


## Events

| Event         | Description | Type                      |
| ------------- | ----------- | ------------------------- |
| `submitLogin` |             | `CustomEvent<LoginEvent>` |


## Dependencies

### Depends on

- [planit-error](../planit-error)
- [planit-button](../planit-button)

### Graph
```mermaid
graph TD;
  planit-login --> planit-error
  planit-login --> planit-button
  style planit-login fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
