import useSWR from 'swr'
import { useEffect } from 'react'
import { setCollections } from '../reducers/collection'
import { useAuthenticatedFetch } from './useAuthenticatedFetch'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { setProducts } from '../reducers/product'

export default function UseFetchProduct() {
    const fetch = useAuthenticatedFetch()
    const { data, error, reloadData } = useSWR('/api/products', async ()=>{
        try {
            const res = await fetch('/api/products');
            return await res.json()
        } catch (error) {
            console.log(error)
        }
    })
    const dispatch = useDispatch()

    useEffect(()=>{
        if(data){
            dispatch(setProducts(data.body.data.products.edges))
        }
    },[])
  }


