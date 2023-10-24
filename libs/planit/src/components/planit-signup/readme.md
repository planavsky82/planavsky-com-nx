# planit-signup



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute             | Description | Type     | Default               |
| ------------------- | --------------------- | ----------- | -------- | --------------------- |
| `labelEmailAddress` | `label-email-address` |             | `string` | `"Email Address"`     |
| `labelPassword1`    | `label-password-1`    |             | `string` | `"Password"`          |
| `labelPassword2`    | `label-password-2`    |             | `string` | `"Re-Enter Password"` |


## Events

| Event          | Description | Type                       |
| -------------- | ----------- | -------------------------- |
| `submitSignup` |             | `CustomEvent<SignUpEvent>` |


## Dependencies

### Depends on

- [planit-error](../planit-error)
- [planit-button](../planit-button)

### Graph
```mermaid
graph TD;
  planit-signup --> planit-error
  planit-signup --> planit-button
  style planit-signup fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
