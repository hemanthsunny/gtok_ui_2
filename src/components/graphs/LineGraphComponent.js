import React from "react";
import { ResponsiveBullet } from '@nivo/bullet'

const LineGraphComponent = ({data}) => (
	<div style={{height: "104px"}}>
	  <ResponsiveBullet
	    data={data}
	    margin={{ top: 50, right: 90, bottom: 50, left: 90 }}
	    spacing={45}
	    titleAlign="start"
	    titleOffsetX={-70}
	    measureSize={0}
	    marketSize={0}
	    animate={true}
	    motionStiffness={90}
	    motionDamping={12}
	  />
	</div>
)

export default LineGraphComponent;