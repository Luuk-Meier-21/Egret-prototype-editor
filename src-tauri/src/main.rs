// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    mem,
    net::SocketAddr,
    sync::{
        mpsc::{self, Sender},
        Arc, Mutex, MutexGuard,
    },
    thread,
};

use futures_util::{stream::StreamExt, SinkExt};
use serde::Serialize;
use tauri::{http::status::StatusCode, AppHandle, Error, Manager};
use tokio::{self, sync::broadcast::channel};
use warp::{
    filters::ws::{Message, WebSocket},
    Filter,
};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Serialize)]
struct ErrorMessage {
    code: u16,
    message: String,
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

fn use_mutex<MT, FT>(mutex: Arc<Mutex<MT>>, func: FT) -> Arc<std::sync::Mutex<MT>>
where
    FT: Fn(MutexGuard<'_, MT>),
    MT: ?Sized,
{
    let inner = mutex.lock();
    if let Ok(result) = inner {
        func(result);
    }
    mutex.clone()
}

#[tauri::command]
async fn start_companion_mode(app: tauri::AppHandle) -> Result<(), Error> {
    tokio::spawn(async move {
        // let app_ref = Arc::new(Mutex::new(app));
        let routes = warp::path("echo")
            // The `ws()` filter will prepare the Websocket handshake.
            .and(warp::ws())
            .map(move |ws: warp::ws::Ws| {
                let app = app.clone();
                // let a = Mutex::new(app.clone());
                &app.emit_all(
                    "ws-connect",
                    Payload {
                        message: "Tauri is awesome!".into(),
                    },
                )
                .unwrap();
                // if let Ok(result) = app.lock() {
                //     result
                //         .emit_all(
                //             "ws-connection",
                //             Payload {
                //                 message: "Tauri is awesome!".into(),
                //             },
                //         )
                //         .unwrap();
                // }
                // And then our closure will be called when it  completes...
                ws.on_upgrade(move |websocket| {
                    app.emit_all(
                        "ws-upgrade",
                        Payload {
                            message: "Tauri is awesome!".into(),
                        },
                    )
                    .unwrap();
                    // if let Ok(result) = app {
                    //     result
                    //         .emit_all(
                    //             "ws-upgrate",
                    //             Payload {
                    //                 message: "Tauri is awesome!".into(),
                    //             },
                    //         )
                    //         .unwrap();
                    // }
                    handle_message(websocket)
                })
            });

        warp::serve(routes).try_bind(([0, 0, 0, 0], 2000)).await;
    });

    Ok(())
}

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, start_companion_mode])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

async fn handle_message(websocket: WebSocket) {
    let mut counter = 0;

    let (mut ws_out, mut ws_in) = websocket.split();

    while let Some(result) = ws_in.next().await {
        if let Ok(message) = result {
            let data = message.to_str().unwrap_or("No value found");
            let tag = "Server: ";
            counter += 1;

            let return_message = Message::text(format!("{tag}{}{data}", counter));

            let _ = ws_out.send(return_message).await;
        }
    }
}
