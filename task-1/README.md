# Task-1

open-build challenge task-1. [go website](https://github.com/openbuildxyz/Web3-Frontend-Bootcamp/blob/main/task/01_React_To-Do-List.md)

## target

### 项目初始化
使用 Create-vite 初始化你的项目。
设置项目结构，创建必要的文件和文件夹。
### 创建组件
App 组件：作为应用的根组件。
Header 组件：展示应用标题。
ToDoList 组件：展示所有待办事项。
ToDoItem 组件：展示单个待办事项。
AddToDo 组件：包含一个输入框和添加按钮，用于添加新的待办事项。
### 实现功能
添加待办事项：用户可以通过输入框输入待办事项，并点击按钮进行添加。
删除待办事项：每个待办事项旁边有一个删除按钮，点击后可以删除该事项。
标记完成：用户可以通过点击待办事项，标记其为已完成或未完成。
保存到本地存储：使用 useEffect 将待办事项保存到本地存储，并在页面刷新时恢复。
### 使用状态管理
使用 useState 管理待办事项列表和输入框的状态。
使用 Hooks
使用 useState 管理组件的状态。
使用 useEffect 实现本地存储的保存和恢复功能。