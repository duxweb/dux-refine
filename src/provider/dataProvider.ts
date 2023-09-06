import { Config } from '../core/config'
import { DataProvider, HttpError, CrudOperators, CrudFilters, MetaQuery } from '@refinedev/core'
import axios, { AxiosHeaderValue } from 'axios'

export const client = axios.create({
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': localStorage.getItem('i18nextLng'),
  },
})

client.interceptors.response.use(
  (response) => {
    return response
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

export const dataProvider = (app: string, config: Config): DataProvider => ({
  getApiUrl: () => config.apiUrl,
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    const path = `${resource}`
    const url = getUrl(config, app, path, meta)
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
    return {
      data: data?.data,
      total: data?.meta?.total,
      message: data?.message,
      meta: data?.meta,
    }
  },
  create: async ({ resource, variables, meta }) => {
    const path = `${resource}`
    const url = getUrl(config, app, path, meta)
    const { data } = await client.post(url, variables, {
      params: meta?.params,
    })
    return {
      code: data?.code,
      data: data?.data,
      message: data?.message,
      meta: data?.meta,
    }
  },
  update: async ({ resource, id, variables, meta }) => {
    let path = `${resource}/${id}`
    if (meta?.mode == 'page') {
      path = resource
    }
    const url = getUrl(config, app, path, meta)
    const { data } = await client.put(url, variables, {
      params: meta?.params,
      headers: {
        Authorization: getToken(app),
        ...meta?.headers,
      },
    })
    return {
      code: data?.code,
      data: data?.data,
      message: data?.message,
      meta: data?.meta,
    }
  },
  deleteOne: async ({ resource, id, variables, meta }) => {
    const path = `${resource}/${id}`
    const url = getUrl(config, app, path, meta)
    const { data } = await client.delete(url, {
      data: variables,
      params: meta?.params,
      headers: {
        Authorization: getToken(app),
        ...meta?.headers,
      },
    })
    return {
      code: data?.code,
      data: data?.data,
      message: data?.message,
      meta: data?.meta,
    }
  },
  getOne: async ({ resource, id, meta }) => {
    let path = `${resource}/${id}`
    if (meta?.mode == 'page') {
      path = resource
    }
    const url = getUrl(config, app, path, meta)
    const { data } = await client.get(url, {
      params: meta?.params,
      headers: {
        Authorization: getToken(app),
        ...meta?.headers,
      },
    })
    return {
      code: data?.code,
      data: data?.data,
      message: data?.message,
      meta: data?.meta,
    }
  },
  getMany: async ({ resource, ids, meta }) => {
    const path = `${resource}`
    const url = getUrl(config, app, path, meta)
    const { data } = await client.get(url, {
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
      code: data?.code,
      data: data?.data,
      message: data?.message,
      meta: data?.meta,
    }
  },
  createMany: async ({ resource, variables, meta }) => {
    const path = `${resource}`
    const url = getUrl(config, app, path, meta)
    const { data } = await client.post(url, variables, {
      params: meta?.params,
      headers: {
        Authorization: getToken(app),
        ...meta?.headers,
      },
    })
    return {
      code: data?.code,
      data: data?.data,
      message: data?.message,
      meta: data?.meta,
    }
  },
  deleteMany: async ({ resource, ids, meta }) => {
    const path = `${resource}`
    const url = getUrl(config, app, path, meta)
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
      code: data?.code,
      data: data?.data,
      message: data?.message,
      meta: data?.meta,
    }
  },
  updateMany: async ({ resource, ids, variables, meta }) => {
    const path = `${resource}`
    const url = getUrl(config, app, path, meta)
    const { data } = await client.put(
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
      code: data?.code,
      data: data?.data,
      message: data?.message,
      meta: data?.meta,
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

    url = getUrl(config, app, url, meta)

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
    const data = axiosResponse.data
    return {
      code: data?.code,
      data: data?.data,
      message: data?.message,
      meta: data?.meta,
    }
  },
})

const getUrl = (config: Config, app: string, path: string, meta?: MetaQuery) => {
  if (meta?.path) {
    path = meta.path
  }
  path = path.replace(/\./g, '/')
  return `${config.apiUrl}/${config.resourcesPrefix ? app + '/' : ''}${path}`
}

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
