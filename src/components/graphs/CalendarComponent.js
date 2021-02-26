import React from "react";
import { ResponsiveCalendar } from '@nivo/calendar'

const CalendarComponent = ({ data, startDate="2015-01-01", endDate }) => {
	endDate = endDate || new Date().toISOString();
	console.log('endDate', endDate)
	endDate="2020-07-28"
	return (
		<div className="card p-0" style={{height: "217px"}}>
		  <ResponsiveCalendar
		    data={data}
		    from={startDate}
		    to={endDate}
		    height={150}
		    emptyColor="#eeeeee"
		    colors={[ '#f47560', '#97e3d5', '#61cdbb' ]}
		    minValue="auto"
		    margin={{ top: 40, right: 20, bottom: 40, left: 20 }}
		    yearSpacing={20}
		    yearLegendOffset={2}
		    yearLegend={(year) => 2020}
		    monthBorderWidth={0}
		    monthBorderColor="#ffffff"
		    monthLegendPosition="after"
		    monthLegendOffset={12}
		    dayBorderColor="#ffffff"
		    legends={[
		      {
		        anchor: 'bottom-right',
		        direction: 'row',
		        translateY: 36,
		        itemCount: 4,
		        itemWidth: 42,
		        itemHeight: 36,
		        itemsSpacing: 14,
		        itemDirection: 'right-to-left'
		      }
		    ]}
		  />
		</div>
	);
}

export default CalendarComponent;