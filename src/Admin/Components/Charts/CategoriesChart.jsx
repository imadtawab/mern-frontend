import { color } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useEffect } from 'react';
import { useRef } from 'react';

export default function CategoriesChart({data=[]}) {
    console.log(data)
    const chartRef = useRef(null);
    const options = {
        tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '0%',
            left: 'center',
          },
          series: [
            {
              name: 'Category',
              type: 'pie',
              top: "15%",
              radius: ['50%', '90%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 20,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: data.map(d => {return {name: d.name, value: d.quantity}})
            }
          ]
        };
      useEffect(() => {
        const handleResize = () => {
          if (chartRef.current) {
            chartRef.current.getEchartsInstance().resize();
          }
        };
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);
    
    
  return (
    <ReactECharts ref={chartRef} option={options}/>
  )
}

