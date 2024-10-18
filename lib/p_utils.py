#
# Some helper functions
#

import socket
import time
from concurrent.futures import ThreadPoolExecutor
from statistics import mean, stdev

import requests


def check_dns(domain):
    try:
        socket.gethostbyname(domain)
        return True
    except socket.gaierror:
        return False


def ping(url, timeout=5):
    try:
        start_time = time.time()
        response = requests.get(url, timeout=timeout)
        end_time = time.time()
        return True, response.status_code, end_time - start_time
    except requests.RequestException:
        return False, None, None


def check_website_health(url, num_pings=5):
    print(f"Checking health for {url}")

    # Check DNS
    domain = url.split("//")[-1].split("/")[0]
    if not check_dns(domain):
        print(f"DNS lookup failed for {domain}")
        return

    # Perform multiple pings
    results = []
    with ThreadPoolExecutor(max_workers=num_pings) as executor:
        futures = [executor.submit(ping, url) for _ in range(num_pings)]
        for future in futures:
            results.append(future.result())

    # Analyze results
    successes = [r for r in results if r[0]]
    if not successes:
        print(f"All {num_pings} requests failed. The website appears to be down.")
        return

    success_rate = len(successes) / num_pings
    response_times = [r[2] for r in successes]
    avg_response_time = mean(response_times)

    print(f"Success rate: {success_rate*100:.1f}%")
    print(f"Average response time: {avg_response_time:.3f} seconds")

    if len(response_times) > 1:
        response_time_stdev = stdev(response_times)
        print(f"Response time standard deviation: {response_time_stdev:.3f} seconds")

    if success_rate < 1:
        print("The connection appears to be degraded.")
    elif avg_response_time > 1:
        print("The website is up, but response times are slow.")
    else:
        print("The website appears to be functioning normally.")


if __name__ == "__main__":
    url = input("Enter the URL to check (including http:// or https://): ")
    check_website_health(url)
