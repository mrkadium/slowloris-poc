import requests
import time

def send_attack_request(url):
    headers = {
        'Host': 'bancoinmobiliario.gt',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.177 Safari/537.36',
        'Connection': 'close',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': '*/*'
    }
    data = 'foo=bar'

    start_time = time.time()
    # Send first request
    response1 = requests.post(url, headers=headers, data=data)
    first_request_time = time.time() - start_time
    print("First request duration: ", first_request_time)

    time.sleep(10)  # Wait for 10 seconds
    
    start_time = time.time()
    # Send second request
    response2 = requests.post(url, headers=headers, data='alpha=beta')
    second_request_time = time.time() - start_time
    print("Second request duration: ", second_request_time)

    return response1, response2, first_request_time, second_request_time

def check_vulnerability(response1, response2, first_request_time, second_request_time):
    if response1.status_code != 200 or response2.status_code != 200:
        return False

    if second_request_time > first_request_time + 10:
        return True

    return False

if __name__ == "__main__":
    url = 'https://bancoinmobiliario.gt/pagos/'
    response1, response2, first_request_time, second_request_time = send_attack_request(url)
    # print("Response1: ", response1.content)
    # print("Response2: ", response2.content)
    if check_vulnerability(response1, response2, first_request_time, second_request_time):
        print("The server is vulnerable to slow POST attack.")
    else:
        print("The server is not vulnerable to slow POST attack.")
