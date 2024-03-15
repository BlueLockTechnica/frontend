import React from 'react'
import Layout from '../../components/Layout/RootLayout'
import DashboardCards from '../../components/Cards/DashboardCards'

type Props = {}

const Dashboard = (props: Props) => {
    return (
        <Layout page='Dashboard'>
            <h1 className='text-3xl'>Call Reports</h1>
            <DashboardCards />
        </Layout>
    )
}

export default Dashboard