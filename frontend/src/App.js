import React, { useEffect } from 'react'
import EC2Resources from './components/EC2Resources'
import RDSResources from './components/RDSResources'
import ResourceDetailsView from './components/ResourceDetailsView'

function App() {
    const [service, setService] = React.useState('EC2')
    const [selectedResource, setSelectedResource] = React.useState(null)


    return (
        <main className='max-h-screen'>
            <div className="flex bg-blue-800 text-white h-12 items-end">
                <div className="px-2 py-2">AWS CC</div>
                <div className="">
                    <button
                        className={`px-2 py-2 hover:rounded-md hover:bg-blue-600 ${
                            service === 'EC2'
                                ? 'bg-white rounded-t text-gray-800'
                                : ''
                        }`}
                        onClick={() => {
                          setSelectedResource(null)
                          setService('EC2')
                        }}
                    >
                        EC2 Intances
                    </button>
                    <button
                        className={`px-2 py-2 hover:rounded-md hover:bg-blue-600 ${
                            service === 'RDS'
                                ? 'bg-white rounded-t text-gray-800'
                                : ''
                        }`}
                        onClick={() => {

                          setSelectedResource(null)
                          setService('RDS')
                        }}
                    >
                        RDS Instances
                    </button>
                    <button
                        className={`px-2 py-2 hover:rounded-md hover:bg-blue-600 ${
                            service === 'Estimations'
                                ? 'bg-white rounded-t text-gray-800'
                                : ''
                        }`}
                        onClick={() => setService('Estimations')}
                    >
                        Estimations
                    </button>
                </div>
            </div>
            {['RDS', 'EC2'].includes(service) && (
                <section className="flex max-h-[calc(100vh-48px)]">
                    {service === 'EC2' && (
                        <EC2Resources
                            setSelectedResource={setSelectedResource}
                        />
                    )}
                    {service === 'RDS' && (
                        <RDSResources
                            setSelectedResource={setSelectedResource}
                        />
                    )}
                    <div className="w-1/2 border-l-gray-800 border-l">
                        {selectedResource ? (
                            <div className='p-2'>
                                <ResourceDetailsView
                                    service={service}
                                    selectedResource={selectedResource}
                                    setSelectedResource={setSelectedResource}
                                />
                            </div>
                        ) : (
                            <div className='flex justify-center items-center h-[calc(100vh-48px)]'>Please select a Instance to view Data</div>
                        )}
                    </div>
                </section>
            )}
            {
              service === 'Estimations' && <div>
                This is estimation
              </div>
            }
        </main>
    )
}

export default App
