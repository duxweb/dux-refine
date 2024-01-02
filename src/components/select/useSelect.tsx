import { useSelect as useRefSelect } from '@refinedev/core'

export const useSelect: typeof useRefSelect = (props) => {
  return useRefSelect({
    onSearch: (value) => [
      {
        field: 'keyword',
        operator: 'eq',
        value,
      },
    ],
    ...props,
  })
}
