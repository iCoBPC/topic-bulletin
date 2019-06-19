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


## Topic-based Scheduling算法，建立协作网络
- Topic的创建：由谁创建？如何创建？
新的业务流程在本地部署后，与其他企业业务协调，需要接入云上工作流协调网络。本地业务流程附加Annotation, 绑定订阅云上共享的协调服务，这些服务和Topic关联，但是这些topic怎么来的呢？由协调器引入，还是参与者携带？这个有点先有鸡还是先有蛋的问题。

    １．　如果参与者(新的业务流程)，发布的topic，没有其他协调器认识，即不存在于当前协调网络，那么此时需要创建该topic,发布在topic-bulletin上，而现在暂时没有协调器实现它，所以该参与者暂时无法运转。一旦有新的协调器为该topic提供了协调器服务，那么该参与者就可以匹配到协作伙伴。
    ２．　如果新的协调器进入，发布了一些面向topic的协调服务，但是这些topic以前不存在，此时需要新建topic,当参与者发观察到这些新的topic，可以订阅它，加入云上工作流协调网络。如果这些topic已经存在，则将订阅了这些的topic的参阅者加入到自己的订阅列表中
协调消息的发布
这里需要建立topics表

```yaml
# Leader topic: 对资源的处理，这种角色的topic决定了与谁建立协调关系
# Follower topic 对事件的传播，只需要转发到正确的地方就行，这种角色的topic依赖于Leader topic建立的协作关系

# 来自参与者的协作请求
# 协作请求包括一组场景相关的topics, 这组topics有唯一的leader角色的topic，topic-bulletin收到协作请求，会为该场景下的topic选择匹配协调器，匹配规则：
# -　协调器必须为topics中的所有topic提供协调服务
# -  

#　所有topics均有同一个协调器处理
topics: pd11, T11:leader    ==> <T11, msc_1, func, T21>
        pd11, T12:follower  ==> <T12, msc_1, func, T22>
        pd11, T13:follower  ==> <T13, msc_1, func, T23>

        <T11, msc_1, T21>  ==> pd21  [Y] # 缸盖供应商
                           ==> pd22  [N] # 发动机供应商
        <T11, msc_2, T21>  ==> pd23  [Y] # 缸盖供应商
                           ==> pd24  [N] # 发动机供应商   

route_results:
==> pd11, [ <T11, T21, leader，msc_1>,    pd21
            <T12, T22, follower,msc_1＞，
        　　＜T13, T23, follower,msc_1＞],
        
        
# 部分follower　topic由其他协调器处理
        pd11, T11:leader    --> <T11, msc_2,T21>
        pd11, T12:follower  --> <T12, msc_1,T22>
        pd11, T13:follower  --> <T13, msc_1,T23>

        <T11, msc_2, T21>  ==> pd21  [N]
                           ==> pd22  [Y]
route_results:
==> pd11, [ <T11, T21, leader，msc_2>,    pd22
            <T12, T22, follower,msc_1＞，
        　　＜T13, T23, follower,msc_1＞],


# 协作网络
主题发布到公告板，
collaboration-network:
    -  source:
        - source_app_id: !ref manager_01
        - source_process_id: !ref pd11
       destination:
        - destination_app_id: 
        - destination_process_id: !ref pd21 # process_definition_id
       scenario: ssp
       business_key: ssp-msc
       coordinator_policy: !ref static
       handlers: 
        -   input_topic: T11
            coordinator_id: msc_1
            coordination_service_id: 
            decision_policy: !ref xxx
            output_topic: T21
        -   input_topic: T12
            coordinator_id: msc_1
            coordination_service_id: 
            decision_policy: !ref xxx
            output_topic: T22
        -   input_topic: T13
            coordinator_id: msc_1
            coordination_service_id: 
            decision_policy: !ref xxx
            output_topic: T23
    -  source:
        - source_app_id: !ref manager_01
        - source_process_id: !ref pd11
       destination:
        - destination_app_id: 
        - destination_process_id: !ref pd22 # process_definition_id　
       scenario: ssp
       business_key: ssp-msc
       coordinator_policy: !ref dynamic
       handlers: 
        -   input_topic: T11
            coordinator_id: msc_2
            coordination_service_id: 
            decision_policy: !ref xxx
            output_topic: T21
        -   input_topic: T12
            coordinator_id: msc_1
            coordination_service_id: 
            decision_policy: !ref xxx
            output_topic: T22
        -   input_topic: T13
            coordinator_id: msc_1
            coordination_service_id: 
            decision_policy: !ref xxx
            output_topic: T23
---

# topic发布/订阅
co-request:
    - publisher:
        - app_id:
        - service_id:
        - process_definition_id:
    - senario:
    - topics:
        - topic_id: !ref
          role: # leader / follower
          activityId:
        - topic_id: !ref xxx
          role:   
          activity_id: 
          
#　topic-bulletin处理请求topic的发布与订阅，会生成两张表
==>
# Topic发布表 pub-topics:
pub-topics:
    - subscriber: 
        - app_id:
        - process_definition_id:
    - scenario: ssp
    - coordinator_policy: !ref xxx
    - topics:
        - pub_topic_id: !ref
          role: # leader / follower
          activityId:
          co_service_id: !ref xxx
          decision_policy: !ref xxx
        - topicid: !ref xxx
          role:   
          activity_id:
          co_service_id: !ref xxx
          decision_policy: !ref xxx
# Topic订阅表 sub-topics
sub-topics:
    - subscriber: 
        - app_id:
        - process_definition_id:
    - scenario: ssp
    - coordinator_policy: 
    - topics:
        - sub_topic_id: !ref
          role: # leader / follower
          activityId:
          co_service_id: !ref xxx
          decision_policy: !ref xxx
        - topic_id: !ref xxx
          role:   
          activity_id:
          co_service_id: !ref xxx
          decision_policy: !ref xxx

---

# 策略库
policies:
    - co_policy_id:
    - co_policy_name:
    - resource:
        id: 
        name: 
        type:
    － constraints:
        - pro:

---
# 决策表
# 定制化协调器服务的发布
coordination-services:
    - co_service_id:
    - co_service_name:
    - coodinator_id:
    - topics: 
        - input_topic:
        - output_topic:
        - error_topic:
        - default_topic:
    - 　　　:
        - decision_policy_id: !ref policy_x
          decision_policy_name:
          handler: !ref lambda_func_x
        - decision_policy_id: !ref policy_y
          decision_policy_name:
          handler: !ref lambda_func_y
        - error_handler: !ref lambda_error_handler
        - default_handler: !ref lambda_default_func



```

- 协作网络的建立

- 运行时即时性协作如何建立