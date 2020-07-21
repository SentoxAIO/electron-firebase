/* setupapp.js
 * electron-firebase
 * This is a quickstart template for building Firebase authentication workflow into an electron app
 * Copyright (c) 2019 by David Asher, https://github.com/david-asher
 * 

'use strict';

/*
 * This module contains functions that help to initialize or update the application
 * @module setupapp
 */

const { firestore, fbstorage } = loadModule( 'electron-firebase' )

const docAboutmeFolder = "aboutme/"

function makeUserDocuments( user, appContext, appConfig )
{
    if ( !user || !user.uid || !user.displayName ) {
        return null
    }

    const isNow = ( new Date() ).toISOString()

    // fixups
    const profile = { ... user.profile }
    if ( !profile.email )        profile.email = user.email || null
    if ( !profile.picture )      profile.picture = user.photoURL || null

    const provider = { ... user.providerData[0] }
    if ( !provider.displayName ) provider.displayName = user.displayName || null
    if ( !provider.email )       provider.displayName = user.email || null
    if ( !provider.phoneNumber ) provider.phoneNumber = user.phoneNumber || null
    if ( !provider.photoURL )    provider.photoURL = user.photoURL || null

    const account = {
        uid: user.uid,
        name: user.displayName,
        photo: user.photoURL || null,
        email: user.email || null,
        created: user.metadata.creationTime || null, 
        accessed: isNow
    }

    const session = {
        uid: user.uid,
        apiKey: global.fbConfig.apiKey || null,
        project: global.fbConfig.projectId || null,
        domain: global.fbConfig.authDomain || null,
        authenticated: user.metadata.lastSignInTime || null,
        start: isNow
    }

    return {
        profile: profile,
        provider: provider,
        account: account,
        session: session,
        application: appContext,
        configuration: appConfig
    }
}

async function updateUserDocs( user, appContext, appConfig )
{
    try {
        const userDocs = makeUserDocuments( user, appContext, appConfig )

        const aboutMe = await firestore.doc.about( docAboutmeFolder + "profile" )

        if ( !aboutMe || !aboutMe.exists ) {
            await firestore.doc.write( docAboutmeFolder + "profile", userDocs.profile )
            await firestore.doc.write( docAboutmeFolder + "provider", userDocs.provider )
            await firestore.doc.write( docAboutmeFolder + "account", userDocs.account )
            await firestore.doc.write( docAboutmeFolder + "session", userDocs.session )    
        }

        const myProfile = await fbstorage.file.about( "aboutme/MyProfile" )

        if ( !myProfile || !myProfile.exists ) {
            await fbstorage.file.upload( "aboutme/MyProfile", userDocs.profile )
            await fbstorage.file.upload( "aboutme/MyAccount", userDocs.account )
            await fbstorage.file.upload( "/info/first/second/MyProfile", userDocs.profile )
            await fbstorage.file.upload( "/info/MyProvider", userDocs.provider )
            await fbstorage.file.upload( "/account/third/my-account", userDocs.account )
            await fbstorage.file.upload( "/account/my-session", userDocs.session )
    
            await fbstorage.app.upload( "account/my-session", userDocs.session )
            await fbstorage.app.upload( "info/MyProvider", userDocs.provider )
    
            await fbstorage.public.upload( "account/my-session", userDocs.session )
            await fbstorage.public.upload( "info/MyProvider", userDocs.provider )  
        }
    }
    catch (error) {
        console.error( error )
    }
}

module.exports = {
    updateUserDocs: updateUserDocs
}

function makeAppDocuments( )
{

}


async function _buildUserDocSet( user )
{
    /************************************************************************************

    const baseDocs = makeBaseDocuments( user )
    if ( !baseDocs ) {
        throw( "invalid user object at buildUserRoot" )
    }

    // create the root document
    await docRoot.set( baseDocs.root, setMergeFields )

    for ( var index in collectionSet ) {
        await addToRootCollections( collectionSet[ index ] )
    }

//    await collectionSet.forEach( async (value, index, array) => {
//        await addToRootCollections( value )
//    })

    // put this application in the apps collection
    await docCreate( collectionSet.apps, baseDocs.application.name, baseDocs.application )

    // create new objects in the documents collection
    await docCreate( collectionSet.docs, "profile",  baseDocs.profile ) 
    await docCreate( collectionSet.docs, "provider", baseDocs.provider ) 
    await docCreate( collectionSet.docs, "account",  baseDocs.account ) 
    await docCreate( collectionSet.docs, "session",  baseDocs.session ) 

    // create the files collection with a first file
    await docCreate( collectionSet.files, "profile", baseDocs.profile )

************************************************************************************/
    return baseDocs.root
}
