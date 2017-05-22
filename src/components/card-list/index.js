import React, { Component } from 'react'
import { Link } from 'react-router'
import Layout from '../layout'

export default ({data}) =>
  <Layout className={'app-layout-wrap'}>
    {data.map( (item, i) => {
      return (
        <Link key={i} to={`/${item.path}/${item.key}`}>
          <Layout className={'app-layout-wrap-item'} key={i} >
            <h2>{item.name}</h2>
          </Layout>
        </Link>
      )
    })}
  </Layout>