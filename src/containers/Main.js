import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

class Main extends Component {
    render() {
        const path = this.props.location.pathname.split('/');
        return (
            <Layout style={{ height: '100%' }}>
                <Layout.Sider style={{ background: '#fff' }}>
                    <Menu
                        theme="light"
                        mode="inline"
                        defaultSelectedKeys={[path[1]]}
                    >
                        <Menu.Item key="chapter-1">
                            <Link to="/chapter-1">Chapter 1</Link>
                        </Menu.Item>
                        <Menu.Item key="chapter-2">
                            <Link to="/chapter-2">Chapter 2</Link>
                        </Menu.Item>
                    </Menu>
                </Layout.Sider>
                <Layout>
                    <Layout.Content>
                        {this.props.children}
                    </Layout.Content>
                </Layout>
            </Layout>
        );
    }
}

export default Main;
