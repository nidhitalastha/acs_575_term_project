import React from 'react'
import axios from 'axios'
import { Table, ScrollArea, Input } from '@mantine/core'
import { Loader } from '@mantine/core'

export default function EC2Resources(props) {
    const [resources, setResources] = React.useState(null)
    const [filterSring, setFilterString] = React.useState("")

    React.useEffect(() => {
        async function fetchEC2Resources() {
            const response = await axios.get(
                'http://localhost:4000/api/ec2/instances'
            )
            console.log(response.data)
            setResources(response.data.data)
        }

        fetchEC2Resources()
    }, [])
    if (!resources) {
        return (
            <div className="flex justify-center items-center w-3/4 h-screen">
                <Loader color="blue" size="xl" type="bars" />;
            </div>
        )
    }

    const rows = resources.filter((ele)=>ele.instance_type.includes(filterSring)).map((element) => {
      return <Table.Tr
            key={element.instance_type}
            className='cursor-pointer'
            onClick={() => {
                props.setSelectedResource(element.instance_type)
            }}
        >
            <Table.Td>{element.instance_type}</Table.Td>
            <Table.Td>{element.generation}</Table.Td>
            <Table.Td>{element.family}</Table.Td>
            <Table.Td>{element.vcpu}</Table.Td>
            <Table.Td>{(element.memory / 1024).toFixed(2)} GiB</Table.Td>
        </Table.Tr>
    })

    return (
        <React.Fragment>
            <ScrollArea className="w-3/4 p-2">
          <Input className='my-2' placeholder='Filter By Instance Type' onChange={(e)=>{setFilterString(e.target.value)}}/>
                <Table
                    stickyHeader
                    striped
                    highlightOnHover
                    withTableBorder
                    withColumnBorders
                    className="max-h-screen overflow-x-auto"
                >
                    <Table.Thead>
                        <Table.Tr className="rounded">
                            <Table.Th className="bg-blue-300 w-1/5 rounded-tl">
                                Instance Type
                            </Table.Th>
                            <Table.Th className="bg-blue-300 w-1/5 ">
                                Genertion
                            </Table.Th>
                            <Table.Th className="bg-blue-300 w-1/5 ">Family</Table.Th>
                            <Table.Th className="bg-blue-300 w-1/5 ">vCPU</Table.Th>
                            <Table.Th className="bg-blue-300 w-1/5 rounded-tr">
                                Memory
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows.length > 0 ? rows : <Table.Tr><Table.Td colSpan={5} className='text-center'>No Data Found</Table.Td></Table.Tr>}</Table.Tbody>
                </Table>
            </ScrollArea>
        </React.Fragment>
    )
}

const REGIONS = [
    {
        value: 'ap-south-2',
        label: 'Asia Pacific (Hyderabad)',
    },
    {
        value: 'ap-south-1',
        label: 'Asia Pacific (Mumbai)',
    },
    {
        value: 'eu-south-1',
        label: 'Europe (Milan)',
    },
    {
        value: 'eu-south-2',
        label: 'Europe (Spain)',
    },
    {
        value: 'me-central-1',
        label: 'Middle East (UAE)',
    },
    {
        value: 'il-central-1',
        label: 'Israel (Tel Aviv)',
    },
    {
        value: 'ca-central-1',
        label: 'Canada (Central)',
    },
    {
        value: 'eu-central-1',
        label: 'Europe (Frankfurt)',
    },
    {
        value: 'eu-central-2',
        label: 'Europe (Zurich)',
    },
    {
        value: 'us-west-1',
        label: 'US West (N. California)',
    },
    {
        value: 'us-west-2',
        label: 'US West (Oregon)',
    },
    {
        value: 'af-south-1',
        label: 'Africa (Cape Town)',
    },
    {
        value: 'eu-north-1',
        label: 'Europe (Stockholm)',
    },
    {
        value: 'eu-west-3',
        label: 'Europe (Paris)',
    },
    {
        value: 'eu-west-2',
        label: 'Europe (London)',
    },
    {
        value: 'eu-west-1',
        label: 'Europe (Ireland)',
    },
    {
        value: 'ap-northeast-3',
        label: 'Asia Pacific (Osaka)',
    },
    {
        value: 'ap-northeast-2',
        label: 'Asia Pacific (Seoul)',
    },
    {
        value: 'me-south-1',
        label: 'Middle East (Bahrain)',
    },
    {
        value: 'ap-northeast-1',
        label: 'Asia Pacific (Tokyo)',
    },
    {
        value: 'sa-east-1',
        label: 'South America (Sao Paulo)',
    },
    {
        value: 'ap-east-1',
        label: 'Asia Pacific (Hong Kong)',
    },
    {
        value: 'ca-west-1',
        label: 'Canada West (Calgary)',
    },
    {
        value: 'ap-southeast-1',
        label: 'Asia Pacific (Singapore)',
    },
    {
        value: 'ap-southeast-2',
        label: 'Asia Pacific (Sydney)',
    },
    {
        value: 'ap-southeast-3',
        label: 'Asia Pacific (Jakarta)',
    },
    {
        value: 'ap-southeast-4',
        label: 'Asia Pacific (Melbourne)',
    },
    {
        value: 'us-east-1',
        label: 'US East (N. Virginia)',
    },
    {
        value: 'us-east-2',
        label: 'US East (Ohio)',
    },
]
