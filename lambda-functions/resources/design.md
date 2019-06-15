- Annotation

```java
public String id = UUID.randomUUID().toString();
    public String name;
    public String pointcutType;
    public String implementationType;
    public String destination;
    public String handler;//可以去除？
    public String script;//可以去除？
    public String processDefinitionId;
    public String targetElementId;
    public String policy;
    public Map<String,Object> awsVariables = new HashMap<>();//map
    public Map<String,Object> processVariables = new HashMap<>();
    public String iftttRules;
    public String IOThub; 我大概ann属性定这样了 你要是觉得缺了 和我说
```

- Message paylocad of collaboration request Sample :
    ```json
    "Message": {
        "msg_Type" : "Collaboration",
        "companyId" : "shipping-company-a",
        "serviceId" : "coall-shipping-process-a",
        "processDefinitionId" : "coal-process-a01",
        "Topics": [
            {
                "name": "/coal/sell",
                "topicId": "coal-sell",
                "type" : "publish",
                "policy": {
                    "goal": "maxmum-profit",
                    "constraint" :{
                        "profit" : "gt 100"
                    }
                },
                "group": "self",
                    "activityId" : "sell-coal-service-task"
            },
            {
                    "name": "coal/deliver",
                    "topicId": "coal-sell",
                    "type" : "publish",
                    "policy": "none",
                    "group": "coal-sell",
                    "activityId" : "deliver-coal-service-task"
            }
        ]               
    }
    ```

- 协调器注册   
    协调器需注册到AWS云上，会生成唯一的UUID, 每个协调器有个本地存储(yaml配置)，仅仅自己可见，初始ID为空，注册后，ID有唯一值
    注册过程：根据业务键去查询是否已存在协调器记录，如果没有，则新增，否则直接返回ID,表明已注册
    ```json
    # Topic Bulletin 提供注册API, 默认bussines key是唯一的，不允许重复
    POST /topic-bulletin/coordinators/{business-key}
    # 触发事件
    "Message": {
        "msg_Type" : "Registration",
        "member_Type": "coordinator"
        "name" : "Logistics Vessel coordinator",
        "ID" : null,
        "bussiness_Key" : "lvc",
        "description" : "Coordinator between vessel and logistics company"       
    }
    ```
- 参与者注册
　可能需要，注册到云上，提供一些企业公共信息
