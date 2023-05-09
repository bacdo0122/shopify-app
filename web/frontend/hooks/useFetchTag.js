import useSWR from 'swr'
import { useEffect } from 'react'
import { setCollections } from '../reducers/collection'
import { useAuthenticatedFetch } from './useAuthenticatedFetch'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { setProducts } from '../reducers/product'
import { setTags } from '../reducers/tag'

export default function UseFetchTag() {
    const fetch = useAuthenticatedFetch()
    const { data, error, reloadData } = useSWR('/api/tags', async ()=>{
        try {
            const res = await fetch('/api/tags');
            return await res.json()
        } catch (error) {
            console.log(error)
        }
    })
    const dispatch = useDispatch()

    useEffect(()=>{
        if(data){
            dispatch(setTags(data.body.data.shop.productTags.edges))
        }
    },[data])
  }


