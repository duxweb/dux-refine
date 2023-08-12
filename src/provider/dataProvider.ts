import config from '@/config'
import { DataProvider, HttpError, CrudOperators, CrudFilters } from '@refinedev/core'
import axios, { AxiosHeaderValue } from 'axios'

export const client = axios.create({
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

client.interceptors.response.use(
  (response) => {
    return response?.data
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      data: error.response?.data?.data,
      statusCode: error.response?.status,
    }

    return Promise.reject(customError)
  }
)

export const dataProvider = (app: string, apiUrl: string): DataProvider => ({
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    const url = `${apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${resource}`
    const { current = 1, pageSize = 10 } = pagination ?? {}

    const quertSorts: Record<string, any> = {}
    sorters?.map((item) => {
      quertSorts[item.field + '_sort'] = item.order
    })

    const queryFilters = generateFilters(filters)

    const { data } = await client.get(url, {
      params: {
        ...{
          page: current,
          pageSize: pageSize,
        },
        ...meta?.params,
        ...queryFilters,
        ...quertSorts,
      },
      headers: {
        Authorization: getToken(app),
        ...meta?.headers,
      },
    })
    const total = data?.total || data?.length || 0
    return {
      data: data?.list || data,
      total,
    }
  },
  create: async ({ resource, variables, meta }) => {
    const url = `${apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${resource}`
    const { data } = await client.post(url, variables, {
      params: meta?.params,
    })
    return {
      data,
    }
  },
  update: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${resource}/${id}`
    const { data } = await client.post(url, variables, {
      params: meta?.params,
      headers: {
        Authorization: getToken(app),
        ...meta?.headers,
      },
    })
    return {
      data,
    }
  },
  deleteOne: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${resource}/${id}`
    const { data } = await client.delete(url, {
      data: variables,
      params: meta?.params,
      headers: {
        Authorization: getToken(app),
        ...meta?.headers,
      },
    })
    return {
      data,
    }
  },
  getOne: async ({ resource, id, meta }) => {
    console.log('meta', meta)
    const url = `${apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${resource}/${id}`
    const { data } = await client.get(url, {
      params: meta?.params,
      headers: {
        Authorization: getToken(app),
        ...meta?.headers,
      },
    })
    return {
      data,
    }
  },
  getApiUrl: () => apiUrl,
  getMany: async ({ resource, ids, meta }) => {
    const { data } = await client.get(
      `${apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${resource}`,
      {
        params: {
          ids: ids.join(','),
          ...meta?.params,
        },
        headers: {
          Authorization: getToken(app),
          ...meta?.headers,
        },
      }
    )
    return {
      data,
    }
  },
  createMany: async ({ resource, variables, meta }) => {
    const url = `${apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${resource}`
    const { data } = await client.post(url, variables, {
      params: meta?.params,
      headers: {
        Authorization: getToken(app),
        ...meta?.headers,
      },
    })
    return {
      data,
    }
  },
  deleteMany: async ({ resource, ids, meta }) => {
    const url = `${apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${resource}`
    const { data } = await client.delete(url, {
      params: {
        ids: ids.join(','),
        ...meta?.params,
      },
      headers: {
        Authorization: getToken(app),
        ...meta?.headers,
      },
    })
    return {
      data,
    }
  },
  updateMany: async ({ resource, ids, variables, meta }) => {
    const url = `${apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${resource}`
    const { data } = await client.post(
      url,
      { variables },
      {
        params: {
          ids: ids.join(','),
          ...meta?.params,
        },
        headers: {
          Authorization: getToken(app),
          ...meta?.headers,
        },
      }
    )

    return {
      data,
    }
  },
  custom: async ({ url, method, filters, sorters, payload, query, headers, meta }) => {
    const quertSorts: Record<string, any> = {}
    sorters?.map((item) => {
      quertSorts[item.field] = item.order
    })

    const queryFilters = generateFilters(filters)

    if (headers) {
      client.defaults.headers = {
        ...client.defaults.headers,
        ...(headers as { [key: string]: AxiosHeaderValue }),
      }
    }

    const params = {
      ...query,
      ...meta?.params,
      ...queryFilters,
      ...quertSorts,
    }

    let axiosResponse
    switch (method) {
      case 'put':
      case 'post':
      case 'patch':
        axiosResponse = await client[method](url, payload, {
          params: params,
          headers: {
            Authorization: getToken(app),
            ...meta?.headers,
          },
        })
        break
      case 'delete':
        axiosResponse = await client.delete(url, {
          data: payload,
          params: params,
          headers: {
            Authorization: getToken(app),
            ...meta?.headers,
          },
        })
        break
      default:
        axiosResponse = await client.get(url, {
          params: params,
          headers: {
            Authorization: getToken(app),
            ...meta?.headers,
          },
        })
        break
    }
    const { data } = axiosResponse
    return { data }
  },
})

export const getToken = (app: string) => {
  const auth = localStorage.getItem(app + ':auth')
  if (!auth) {
    return
  }
  const { token } = JSON.parse(auth)
  return token
}

const generateFilters = (filters?: CrudFilters) => {
  const queryFilters: { [key: string]: string } = {}

  filters?.map((filter): void => {
    if ('field' in filter) {
      const { field, operator, value } = filter
      const mappedOperator = mapOperator(operator)
      queryFilters[`${field}${mappedOperator}`] = value
    }
  })

  return queryFilters
}

const mapOperator = (operator: CrudOperators): string => {
  switch (operator) {
    case 'ne':
    case 'gte':
    case 'lte':
      return `_${operator}`
    case 'contains':
      return '_like'
    case 'eq':
    default:
      return ''
  }
}
