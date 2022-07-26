import {useState, useEffect} from 'react'
import {deleteStudent, getAllStudents} from "./client";
import {
  Layout,
  Menu,
  Breadcrumb,
  Table,
  Spin,
  Empty,
  Button,
  Tag,
  Badge,
  Avatar,
  Radio,
  Popconfirm,
  Image, Divider
} from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import StudentDrawerForm from "./StudentDrawerForm";

import './App.css';
import {errorNotification, successNotification} from "./Notification";

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

const TheAvatar = ({name}) => {
  let trimmed = name.trim();
  if (trimmed.length === 0) {
    return <Avatar icon={<UserOutlined/>}/>
  }
  const split = trimmed.split(" ");
  if (split.length === 1) {
    return <Avatar icon={name.charAt(0)}/>
  }
  return <Avatar>
    {`${name.charAt(0)}${name.charAt(name.length - 1)}`}
  </Avatar>
}

const removeStudent = (studentId, studentName, callback) => {
  deleteStudent(studentId)
      .then(() => {
        successNotification("Student deleted!", `Student ${studentName} with the ID: ${studentId} was deleted!`);
        callback();
      })
      .catch(err => {
        err.response.json().then(res => {
          console.log(res);
          errorNotification(
              "There was an issue while removing the Student.",
              `[HTTP ${res.status} - ${res.error}]: ${res.message}`
          )
        });
      });
}

const columns = fetchStudents => [
  {
    title: '',
    dataIndex: 'avatar',
    key: 'avatar',
    render: (text, student) =>
        <TheAvatar name={student.name}/>
  },
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (text, student) =>
        <Radio.Group>
          <Popconfirm
              placement='topRight'
              title={`Are you sure you want to delete ${student.name}?`}
              onConfirm={() => removeStudent(student.id, student.name, fetchStudents)}
              //onConfirm={() => removeStudent(13453, student.name, fetchStudents)}
              okText='Yes'
              cancelText='No'>
            <Radio.Button value="small">Delete</Radio.Button>
          </Popconfirm>
          <Radio.Button value="small">Edit</Radio.Button>
        </Radio.Group>
  }
];

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

function App() {
  const [students, setStudents] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);

  const fetchStudents = () =>
      getAllStudents()
          .then(res => res.json())
          .then(data => {
            console.log(data);
            setStudents(data);
          })
          .catch(err => {
            console.log(err.response);
            err.response.json().then(res => {
              console.log(res);
              errorNotification(
                  "There was an issue!",
                  `[HTTP ${res.status} - ${res.error}]: ${res.message}`
              )
            })
          })
          .finally(setFetching(false));

  useEffect(() => {
    console.log("component is mounted");
    fetchStudents();
  }, []);

  const renderStudents = () => {
    //console.log("IM BEING CALLED AS F!")
    if (fetching) {
      return <Spin indicator={antIcon}/>
    }
    if (students.length <= 0) {
      return <>
        <Button
            onClick={() => setShowDrawer(!showDrawer)}
            type="primary" shape="round" icon={<PlusOutlined/>} size="small">
          Add New Student
        </Button>
        <StudentDrawerForm
            showDrawer={showDrawer}
            setShowDrawer={setShowDrawer}
            fetchStudents={fetchStudents}
        />
        <Empty/>
      </>
    }
    return <>
      <StudentDrawerForm
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
          fetchStudents={fetchStudents}
      />
      <Table
          dataSource={students}
          columns={columns(fetchStudents)}
          bordered
          title={() =>
              <>
                <Tag>Number of students</Tag>
                <Badge count={students.length} className="site-badge-count-4"/>
                <br/><br/>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                  Add New Student
                </Button>
              </>
          }
          pagination={{pageSize: 50}}
          scroll={{y: 500}}
          rowKey={student => student.id}
      />
    </>;
  }

  return <Layout style={{minHeight: '100vh'}}>
    <Sider collapsible collapsed={collapsed}
           onCollapse={setCollapsed}>
      <div className="logo"/>
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="1" icon={<PieChartOutlined/>}>
          Dashboards
        </Menu.Item>
        <Menu.Item key="2" icon={<DesktopOutlined/>}>
          Subjects
        </Menu.Item>
        <SubMenu key="sub1" icon={<UserOutlined/>} title="User">
          <Menu.Item key="3">Tom</Menu.Item>
          <Menu.Item key="4">Bill</Menu.Item>
          <Menu.Item key="5">Alex</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<TeamOutlined/>} title="Classes">
          <Menu.Item key="6">Class 1</Menu.Item>
          <Menu.Item key="8">Class 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="9" icon={<FileOutlined/>}>
          Study Material
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout className="site-layout">
      <Header className="site-layout-background" style={{padding: 0}}/>
      <Content style={{margin: '0 16px'}}>
        <Breadcrumb style={{margin: '16px 0'}}>
          <Breadcrumb.Item>Students</Breadcrumb.Item>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
          {renderStudents()}
        </div>
      </Content>
      <Footer style={{textAlign: 'center'}}>
        <Image
            width={75}
            src='icon-harness-bw-4070551b1e.svg'
        />
        <Divider>
          <a
              target="_blank"
              rel="noreferrer"
              href="https://www.linkedin.com/in/gabrielcerioni">
            Gabs LinkedIn
          </a>
        </Divider>
      </Footer>
    </Layout>
  </Layout>
}

export default App;
