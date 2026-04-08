import asyncio


class Server:
    def __init__(self, url: str):
        self.url = url
        self.number_of_request = 0


class LoadBalancer:
    def __init__(self):
        self.servers = []
        self.lock = asyncio.Lock()

    def register_server(self, server: Server):
        self.servers.append(server)

    async def handle_request(self):
        async with self.lock:
            if not self.servers:
                raise Exception("No servers available")

            # pick server with least active requests
            server = min(self.servers, key=lambda s: s.number_of_request)
            server.number_of_request += 1

        try:
            # simulate request processing
            print(f"Request sent to {server.url}")
            await asyncio.sleep(1)

        finally:
            # decrease count after request completes
            async with self.lock:
                server.number_of_request -= 1


# Example usage
async def main():
    balancer = LoadBalancer()

    balancer.register_server(Server("server1"))
    balancer.register_server(Server("server2"))
    balancer.register_server(Server("server3"))

    tasks = [balancer.handle_request() for _ in range(10)]
    await asyncio.gather(*tasks)


asyncio.run(main())