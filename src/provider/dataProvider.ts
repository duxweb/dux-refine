import { Config } from '../core/config'
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
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    let path = `${resource}`
    if (meta?.path) {
      path = meta.path
    }
    const url = `${config.apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${path}`
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
      data: data?.data?.list,
      total: data?.data?.total,
      message: data?.message,
      rawData: data?.data,
    }
  },
  create: async ({ resource, variables, meta }) => {
    let path = `${resource}`
    if (meta?.path) {
      path = meta.path
    }
    const url = `${config.apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${path}`
    const { data } = await client.post(url, variables, {
      params: meta?.params,
    })
    return {
      code: data?.code,
      data: data?.data?.info,
      message: data?.message,
      rawData: data?.data,
    }
  },
  update: async ({ resource, id, variables, meta }) => {
    let path = `${resource}/${id}`
    if (meta?.mode == 'page') {
      path = resource
    }
    if (meta?.path) {
      path = meta.path
    }
    const url = `${config.apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${path}`
    const { data } = await client.post(url, variables, {
      params: meta?.params,
      headers: {
        Authorization: getToken(app),
        ...meta?.headers,
      },
    })
    return {
      code: data?.code,
      data: data?.data?.info,
      message: data?.message,
      rawData: data?.data,
    }
  },
  deleteOne: async ({ resource, id, variables, meta }) => {
    let path = `${resource}/${id}`
    if (meta?.path) {
      path = meta.path
    }
    const url = `${config.apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${path}`
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
      data: data?.data?.info,
      message: data?.message,
      rawData: data?.data,
    }
  },
  getOne: async ({ resource, id, meta }) => {
    let path = `${resource}/${id}`
    if (meta?.mode == 'page') {
      path = resource
    }
    if (meta?.path) {
      path = meta.path
    }
    const url = `${config.apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${path}`
    const { data } = await client.get(url, {
      params: meta?.params,
      headers: {
        Authorization: getToken(app),
        ...meta?.headers,
      },
    })
    return {
      code: data?.code,
      data: data?.data?.info,
      message: data?.message,
      rawData: data?.data,
    }
  },
  getApiUrl: () => config.apiUrl,
  getMany: async ({ resource, ids, meta }) => {
    let path = `${resource}`
    if (meta?.path) {
      path = meta.path
    }
    const { data } = await client.get(
      `${config.apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${path}`,
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
      data: data?.data?.list,
      message: data?.message,
      rawData: data?.data,
    }
  },
  createMany: async ({ resource, variables, meta }) => {
    let path = `${resource}`
    if (meta?.path) {
      path = meta.path
    }
    const url = `${config.apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${path}`
    const { data } = await client.post(url, variables, {
      params: meta?.params,
      headers: {
        Authorization: getToken(app),
        ...meta?.headers,
      },
    })
    return {
      code: data?.code,
      data: data?.data?.info,
      message: data?.message,
      rawData: data?.data,
    }
  },
  deleteMany: async ({ resource, ids, meta }) => {
    let path = `${resource}`
    if (meta?.path) {
      path = meta.path
    }
    const url = `${config.apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${path}`
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
      data: data?.data?.info,
      message: data?.message,
      rawData: data?.data,
    }
  },
  updateMany: async ({ resource, ids, variables, meta }) => {
    let path = `${resource}`
    if (meta?.path) {
      path = meta.path
    }
    const url = `${config.apiUrl}/${config.resourcesPrefix ? meta?.app + '/' : ''}${path}`
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
      code: data?.code,
      data: data?.data?.info,
      message: data?.message,
      rawData: data?.data,
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
    return axiosResponse.data
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
