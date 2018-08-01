import React from 'react'
import axios from 'axios'
const { ipcRenderer } = require('electron')

class DropZone extends React.Component {

    constructor() {
        super()
        this.state = {
            id: '',
            total: '',
            name: ''
        }
        this.displayName = this.displayName.bind(this)
    }

    getRequest = async () => {
        const results = await axios.get('https://fhirtest.uhn.ca/baseDstu3/Binary')
        return results
    }

    componentDidMount = async () => {
        this.getRequest()
            .then((res) => {
                let { total } = res.data
                this.setState({ ...this.state, total })
            })

        ipcRenderer.on('fileupload', (e, file) => {
            axios.post('https://fhirtest.uhn.ca/baseDstu3/Binary', new FormData({ 'file': file }))
                .then((res) => {
                    let id = res.data.issue[0].diagnostics.match(/\d/g).join("")
                    this.setState({ ...this.state, id })
                })
                .then(this.getTotal())
                .catch((err) => {
                    console.error(err)
                    alert("Sorry, the document couldn't be uploaded")
                })
        })
    }

    dragOverHandler = (e) => {
        e.preventDefault()
    }

    constructFile = (e) => {
        e.preventDefault()

        let { name } = e.dataTransfer.files[0]
        const data = new FormData()
        data.append('file', e.dataTransfer.files[0])
        data.append('name', name)
        return data
    }

    handleDrop = (e) => {
        var data = this.constructFile(e)
        var { name } = e.dataTransfer.files[0]
        axios.post('https://fhirtest.uhn.ca/baseDstu3/Binary', data)
            .then((res) => {
                let id = res.data.issue[0].diagnostics.match(/\d/g).join("")
                console.log(name)
                this.setState({ ...this.state, name, id })
            })
            .then(this.getTotal())
            .catch((err) => {
                console.error(err)
                alert("Sorry, the document couldn't be uploaded")
            })
    }

    getTotal = () => {
        this.getRequest()
            .then((res) => {
                var { total } = res.data
                if (total === this.state.total) {
                    total++
                }
                this.setState({ ...this.state, total })

            })
    }

    displayName = () => {
        var { name, id, total } = this.state
        if (id !== '' && total !== '') {
            return (
                <div>
                    <h1> {`Your file ${name} has been uploaded ! Its id is : ${id}`}</h1>
                    <h2>{`There are currently ${total} binary documents in the DataBase`}</h2>
                </div>
            )
        }
        else { return (<h1> Upload the document you want ! </h1>) }
    }

    render() {
        return (
            <div>
                <div
                    className="dropping-zone"
                    onDragOver={(e) => { this.dragOverHandler(e) }}
                    onDrop={(e) => { this.handleDrop(e) }}
                >
                    <h1>Hello DropZone</h1>
                    {this.displayName()}
                    <form action="">
                        <input className="hello" type="file" />
                    </form>
                </div>
            </div>
        )
    }
}

export default DropZone