const assert = require('assert');
const firebase = require('@firebase/rules-unit-testing');

const PROJ_ID = 'listshare-a3375';
const myId = "user_abc";
const email = "abc@gmail.com";
const myAuth = {uid: myId, email: email};

function getFirestore(auth) {
    return firebase.initializeTestApp({projectId: PROJ_ID, auth: auth}).firestore();
}

describe("List share app", () => {

    beforeEach(async (done) => {
        done();
    })

    afterEach((done) => {
        firebase.clearFirestoreData({
            projectId: PROJ_ID
        });
        done();
    })

    it('Understands basic math', () => {
        assert.strictEqual(2+2, 4);
    })

    it("Can read user collection", async () => {
        const db = getFirestore(null);
        const testDoc = db.collection("users").doc("testDoc");
        await firebase.assertSucceeds(testDoc.get());
    })

    it("Can't create in user collection while logged out", async () => {
        const db = getFirestore(null);
        const testDoc = db.collection("users").doc("testDoc");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    })

    it("Can create group while logged In", async () => {
        const db = getFirestore(myAuth);
        const testDoc = db.collection('groups').doc("New Groupy");
        await firebase.assertSucceeds(testDoc.set({foo: "bar"}));
    })

    it("Can't create group while logged out.", async () => {
        const db = getFirestore(null);
        const testDoc = db.collection('groups').doc("New Group123");
        await firebase.assertFails(testDoc.set({foo: "bar"}));
    })

    it("Can query groups which they are a member of", async () => {
        const db = getFirestore(myAuth);
        const testDoc = db.collection('groups').where("members", "array-contains", "user_abc");
        await firebase.assertSucceeds(testDoc.get());
    })

    it("Can add tasks to group which they are a member of", async () => {
        const db = getFirestore(myAuth);
        const testgroup = db.collection('groups').doc('some-group');
        await testgroup.set({name: 'test group', members: ['user_abc']});
        await firebase.assertSucceeds(testgroup.collection('tasks').add({complete: false, name: 'test code'}));
    })

    it("Can't add tasks to group which they aren't a member of", async () => {
        const db = getFirestore(myAuth);
        const testgroup = db.collection('groups').doc('some-group');
        await testgroup.set({name: 'test group', members: ['user_xyz']});
        await firebase.assertFails(testgroup.collection('tasks').add({complete: false, name: 'test code'}));
    })

    it("Can read tasks of group which they are a member of", async () => {
        const db = getFirestore(myAuth);
        const testgroup = db.collection('groups').doc('some-group');
        await testgroup.set({name: 'test group', members: ['user_abc']});
        await firebase.assertSucceeds(testgroup.collection('tasks').get());
    })

    it("Can't read tasks to group which they aren't a member of", async () => {
        const db = getFirestore(myAuth);
        const testgroup = db.collection('groups').doc('some-group');
        await testgroup.set({name: 'test group', members: ['user_xyz']});
        await firebase.assertFails(testgroup.collection('tasks').get());
    })
})
