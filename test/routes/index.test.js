import fs from 'fs'
import { expect } from 'code'
import sinon from 'sinon'
import Router from '../../src/routes'

describe('Router', () => {
    const sandbox = sinon.createSandbox()
    const mockFiles = [
        'check.js',
        'index.js'
    ]
    const mockApp = {
        use: sandbox.spy()
    }
    beforeEach(() => {
        sandbox.stub(fs, 'readdirSync').returns(mockFiles)
        sandbox.stub(Router, 'importRouter').returns(sandbox.spy())
        Router.build(mockApp)
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('should build all routes in the cur dir except index.js ', () => {
        expect(mockApp.use.calledWith('/check')).to.be.true()
    })
})