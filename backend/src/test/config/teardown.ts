// Teardown function - closing server
export default async (globalConfig: any, projectConfig: any) => {
    global.server.close()
}