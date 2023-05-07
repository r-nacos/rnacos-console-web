use rust_embed::{RustEmbed, EmbeddedFile};



#[derive(RustEmbed)]
#[folder = "src/dist"]
struct Asset;

pub fn get_embedded_file(path: &str) -> Option<EmbeddedFile>{
    Asset::get(path)
}