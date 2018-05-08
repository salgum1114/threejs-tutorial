import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import CHAPTERS from '../chapters';

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
                        {
                            CHAPTERS.map((CHAPTER) => {
                                return (
                                    <Menu.Item key={CHAPTER.key}>
                                        <Link to={CHAPTER.key}>{CHAPTER.name}</Link>
                                    </Menu.Item>
                                );
                            })
                        }
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
