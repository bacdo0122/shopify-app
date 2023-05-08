import useSWR from 'swr'
import { useEffect } from 'react'
import { setCollections } from '../reducers/collection'
import { useAuthenticatedFetch } from './useAuthenticatedFetch'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

export default function UseFetchCollection() {
    const fetch = useAuthenticatedFetch()
    const { data, error, reloadData } = useSWR('/api/collections', async ()=>{
        try {
            const res = await fetch('/api/collections');
            return await res.json()
        } catch (error) {
            console.log(error)
        }
    })
    const dispatch = useDispatch()

    useEffect(()=>{
        if(data){
            dispatch(setCollections(data.body.data.collections.edges))
        }
    },[data])
  }


