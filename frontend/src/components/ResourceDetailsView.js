import React from 'react'
import axios from 'axios'
import { ScrollArea, Table } from '@mantine/core'
import { Loader } from '@mantine/core'

export default function ResourceDetailsView(props) {
    const [resourceDetails, setResourceDetails] = React.useState(null)

    React.useEffect(() => {
      if(!props.selectedResource){
        console.log('No resource selected')
        setResourceDetails(null)
        return
      }

        async function fetchEC2Resources() {
            const response = await axios.get(
                `http://localhost:4000/api/${props.service}/instances/${props.selectedResource}`
            )
            console.log(response.data)
            setResourceDetails(response.data.data)
        }

        fetchEC2Resources()
    }, [props.selectedResource])
    if (!resourceDetails) {
        return (
            <div className="flex justify-center items-center w-full h-screen">
                <Loader color="blue" size="xl" type="bars" />;
            </div>
        )
    }

    if (props.service === 'EC2') {
        return (
            <div className="max-h-[calc(100vh-48px)]">
                <h1 className="text-xl">Instance Details</h1>
                <div>
                    <ScrollArea className="my-4">
                        <Table
                            stickyHeader
                            striped
                            highlightOnHover
                            withTableBorder
                            withColumnBorders
                        >
                            <Table.Thead>
                                <Table.Tr className="rounded">
                                    <Table.Th className="bg-blue-300 rounded-tl w-1/2">
                                        Compute
                                    </Table.Th>
                                    <Table.Th className="bg-blue-300 rounded-tl w-1/2">
                                        Values
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Td>Instance Type</Table.Td>
                                    <Table.Td>
                                        {resourceDetails.instance_type}
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>Generation</Table.Td>
                                    <Table.Td>
                                        {resourceDetails.generation}
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>Family</Table.Td>
                                    <Table.Td>
                                        {resourceDetails.family}
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>vCPU</Table.Td>
                                    <Table.Td>{resourceDetails.vcpu}</Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>Memory</Table.Td>
                                    <Table.Td>
                                        {resourceDetails.memory} MB
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>Memory per vCPU</Table.Td>
                                    <Table.Td>
                                        {resourceDetails.memory_per_vcpu} MB
                                    </Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </div>
                <div>
                    <ScrollArea className="my-4">
                        <Table
                            stickyHeader
                            striped
                            highlightOnHover
                            withTableBorder
                            withColumnBorders
                        >
                            <Table.Thead>
                                <Table.Tr className="rounded">
                                    <Table.Th className="bg-blue-300 rounded-tl w-1/2">
                                        Processor
                                    </Table.Th>
                                    <Table.Th className="bg-blue-300 rounded-tl w-1/2">
                                        Values
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Td>Architecture</Table.Td>
                                    <Table.Td>
                                        {resourceDetails.cpu_info.arch}
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>Physical Processor</Table.Td>
                                    <Table.Td>
                                        {
                                            resourceDetails.cpu_info
                                                .physical_processor
                                        }
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>Clock Speed</Table.Td>
                                    <Table.Td>
                                        {
                                            resourceDetails.cpu_info
                                                .clock_speed_ghz
                                        }
                                    </Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </div>
                <div>
                    <ScrollArea className="my-4">
                        <Table
                            stickyHeader
                            striped
                            highlightOnHover
                            withTableBorder
                            withColumnBorders
                        >
                            <Table.Thead>
                                <Table.Tr className="rounded">
                                    <Table.Th className="bg-blue-300 rounded-tl w-1/2">
                                        Networking
                                    </Table.Th>
                                    <Table.Th className="bg-blue-300 rounded-tl w-1/2">
                                        Values
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Td>
                                        Default Network Card Index
                                    </Table.Td>
                                    <Table.Td>
                                        {
                                            resourceDetails.networking
                                                .DefaultNetworkCardIndex
                                        }
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>
                                        IPv4 Addresses Per Interface
                                    </Table.Td>
                                    <Table.Td>
                                        {
                                            resourceDetails.networking
                                                .Ipv4AddressesPerInterface
                                        }
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>
                                        IPv6 Addresses Per Interface
                                    </Table.Td>
                                    <Table.Td>
                                        {
                                            resourceDetails.networking
                                                .Ipv6AddressesPerInterface
                                        }
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>IPv6 Supported</Table.Td>
                                    <Table.Td>
                                        {
                                            resourceDetails.networking
                                                .Ipv6Supported
                                        }
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>Maximum Network Cards</Table.Td>
                                    <Table.Td>
                                        {
                                            resourceDetails.networking
                                                .MaximumNetworkCards
                                        }
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>
                                        Maximum Network Interfaces
                                    </Table.Td>
                                    <Table.Td>
                                        {
                                            resourceDetails.networking
                                                .MaximumNetworkInterfaces
                                        }
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>Network Performance</Table.Td>
                                    <Table.Td>
                                        {
                                            resourceDetails.networking
                                                .NetworkPerformance
                                        }
                                    </Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </div>
                <div>
                    <ScrollArea className="my-4">
                        <Table
                            stickyHeader
                            striped
                            highlightOnHover
                            withTableBorder
                            withColumnBorders
                        >
                            <Table.Thead>
                                <Table.Tr className="rounded">
                                    <Table.Th className="bg-blue-300 rounded-tl w-1/2">
                                        Storage
                                    </Table.Th>
                                    <Table.Th className="bg-blue-300 rounded-tl w-1/2">
                                        Values
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Td>EBS Optimized Support</Table.Td>
                                    <Table.Td>
                                        {
                                            resourceDetails.storage
                                                .EbsOptimizedSupport
                                        }
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>Encryption Support</Table.Td>
                                    <Table.Td>
                                        {
                                            resourceDetails.storage
                                                .EncryptionSupport
                                        }
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>NVMe Support</Table.Td>
                                    <Table.Td>
                                        {resourceDetails.storage.NvmeSupport}
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>EBS Baseline IOPS </Table.Td>
                                    <Table.Td>
                                        {
                                            resourceDetails.storage.EbsOptimizedInfo ? resourceDetails.storage.EbsOptimizedInfo.BaselineIops : 'N/A'
                                        }
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>EBS Baseline Throughput</Table.Td>
                                    <Table.Td>
                                        {
                                            resourceDetails.storage
                                                .EbsOptimizedInfo?
                                                resourceDetails.storage.EbsOptimizedInfo.BaselineThroughputInMBps : "N/A"
                                        }
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>EBS Maximum IOPS</Table.Td>
                                    <Table.Td>
                                        {
                                            resourceDetails.storage
                                                .EbsOptimizedInfo? resourceDetails.storage.EbsOptimizedInfo.MaximumIops :'N/A'
                                        }
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>EBS Maximum Throughput</Table.Td>
                                    <Table.Td>
                                        {
                                            resourceDetails.storage
                                                .EbsOptimizedInfo ? resourceDetails.storage.EbsOptimizedInfo.MaximumThroughputInMBps :'N/A'
                                        }
                                    </Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </div>
                <div>
                    <ScrollArea className="h-96">
                        <Table
                            stickyHeader
                            striped
                            highlightOnHover
                            withTableBorder
                            withColumnBorders
                        >
                            <Table.Thead>
                                <Table.Tr className="rounded">
                                    <Table.Th className="bg-blue-300 rounded-tl w-1/3">
                                        Region
                                    </Table.Th>
                                    <Table.Th className="bg-blue-300 w-1/3">
                                        Operating System
                                    </Table.Th>
                                    <Table.Th className="bg-blue-300 rounded-tr w-1/3">
                                        Price
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {resourceDetails.EC2Pricings.map((pricing) => (
                                    <Table.Tr
                                        key={
                                            pricing.region +
                                            pricing.operating_system
                                        }
                                    >
                                        <Table.Td>{pricing.region}</Table.Td>
                                        <Table.Td>
                                            {pricing.operating_system}
                                        </Table.Td>
                                        <Table.Td>{pricing.price}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <h1 className="text-xl">DB Instance Details</h1>
                <div>
                    <ScrollArea className="my-4">
                        <Table
                            stickyHeader
                            striped
                            highlightOnHover
                            withTableBorder
                            withColumnBorders
                        >
                            <Table.Thead>
                                <Table.Tr className="rounded">
                                    <Table.Th className="bg-blue-300 rounded-tl w-1/2">
                                        Instance
                                    </Table.Th>
                                    <Table.Th className="bg-blue-300 rounded-tl w-1/2">
                                        Values
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Td>Instance Type</Table.Td>
                                    <Table.Td>
                                        {resourceDetails.instance_type}
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>Generation</Table.Td>
                                    <Table.Td>
                                        {resourceDetails.generation}
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>Family</Table.Td>
                                    <Table.Td>
                                        {resourceDetails.family}
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>vCPU</Table.Td>
                                    <Table.Td>{resourceDetails.vcpu}</Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>Memory</Table.Td>
                                    <Table.Td>
                                        {resourceDetails.memory}
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>Physical Processor</Table.Td>
                                    <Table.Td>
                                        {resourceDetails.physical_processor}
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td>Processor Architecture</Table.Td>
                                    <Table.Td>
                                        {resourceDetails.processor_architecture}
                                    </Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </div>
                <div>
                    <ScrollArea className="h-96">
                        <Table
                            stickyHeader
                            striped
                            highlightOnHover
                            withTableBorder
                            withColumnBorders
                        >
                            <Table.Thead>
                                <Table.Tr className="rounded">
                                    <Table.Th className="bg-blue-300 rounded-tl w-1/4">
                                        Region
                                    </Table.Th>
                                    <Table.Th className="bg-blue-300 w-1/4">
                                        Deployment Option
                                    </Table.Th>
                                    <Table.Th className="bg-blue-300 w-1/4">
                                        Database Engine
                                    </Table.Th>
                                    <Table.Th className="bg-blue-300 rounded-tr w-1/4">
                                        Price
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {resourceDetails.RDSPricings.map((pricing) => (
                                    <Table.Tr
                                        key={
                                            pricing.region +
                                            pricing.database_engine +
                                            pricing.deployment_option
                                        }
                                    >
                                        <Table.Td>{pricing.region}</Table.Td>
                                        <Table.Td>
                                            {pricing.deployment_option}
                                        </Table.Td>
                                        <Table.Td>
                                            {pricing.database_engine}
                                        </Table.Td>
                                        <Table.Td>${pricing.price} /Hr</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </div>
            </div>
        )
    }
}
