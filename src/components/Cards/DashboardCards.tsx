import React from 'react'
import CardLayout from '../Layout/CardLayout'
import PieChartWithCenterLabel from '../PieChart'

type Props = {}


const DashboardCards = (props: Props) => {
    return (
        <div className='grid grid-cols-3 grid-rows-2 gap-10 '>
            <CardLayout title='Total Analyzed Calls' value='100' />
            <CardLayout title='Top Red Flags' value='100' />
            <CardLayout title='Flag Distribution' rows={2}>
                <PieChartWithCenterLabel />
            </CardLayout>
            <CardLayout title='Mean Flagged Calltime' value='100' />
            <CardLayout title='Scams Reported' value='100' />
            <CardLayout title='Scams Reported' value='100' />
        </div>
    )
}

export default DashboardCards