'use client'

import TableSumbangan from '@/app/components/TableSumbangan'
import {useState, useEffect} from 'react'


export default function Home() {
    const [dataSumbangan, setDataSumbangan] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [dataModal, setDataModal] = useState({})
    
    function handle() {
        setOpenModal((prev) => !prev)
    }
    function handleDetails(data : any) {
        setDataModal(data);
        setOpenModal((prev) => !prev)
    }

    useEffect(() => {
        async function fetching() {
            const response = await fetch("/api/sumbangan")
            const responseData = await response.json()
            setDataSumbangan(responseData);
        }

        fetching()

    }, [])

    return <div>
        <TableSumbangan data={dataSumbangan} handleDetails={handleDetails}/>
    </div>
}