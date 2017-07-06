
**GitHub Repo: https://github.com/jtkinser/tnsTesting**

The REST API endpoints are "secured" using basic authentication. 
Username: user1
Password: secret

Part One

1. To login just hit this URL:  http://localhost:1337/login
    - You must use basic auth with the above username and password in your request header.

2. To logout just hit this URL:  http://localhost:1337/logout

Part Two

1. Get configuration data by hitting this URL: http://localhost:1337/getConfigs

2. Create a configuration by posting JSON to this URL: http://localhost:1337/createConfigs
    - The file will be named serverConfig.json and will be located in the project root.
    Example POST body payload:
    
 ```
  {
      "name": "host22",
      "hostname": "iWantThisJob.lab.com",
      "port": 3384,
      "username": "jesse"
  }
```
3. Delete configuration by posting to this URL: localhost:1337/deleteConfig?configName=host2
    - The config name should be the name of the configuration you wish to delete

4. Modify configurations by posting to this URL: localhost:1337/editConfig?configName=host2
    - The config name should be the name of the configuration you wish to modify
    - The POST body should contain the full JSON configuration of the item you wish to update.
    Example POST body payload:
    
    ```
        {
            "name": "host24",
            "hostname": "ideas.lab.com",
            "port": 444,
            "username": "andrew"
        }
   ```
    
Part Three

1. Sort configurations by port, name, hostname and username by calling these URLs:
    - Port: localhost:1337/getConfigs?sortby=port
    - Hostname: localhost:1337/getConfigs?sortby=hostname
    - Name: localhost:1337/getConfigs?sortby=name
    - Username: localhost:1337/getConfigs?sortby=username
    
2. Paginate configurations by by calling these URLs:
    - Without sorting: localhost:1337/getConfigs?page=2
    - With sorting: localhost:1337/getConfigs?sortby=name&page=2