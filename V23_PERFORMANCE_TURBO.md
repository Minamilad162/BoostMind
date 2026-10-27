# Boost Mind v23 — Performance Turbo

- Disabled costly full-screen canvas CSS filters.
- Disabled WebGL MSAA and switched shaders to medium precision.
- Reduced render resolution to 0.72x mobile / 0.86x tablet / 1.0x desktop, with adaptive downscaling when render cost is high.
- Increased target motion cadence to 45 FPS mobile / 60 FPS desktop after reducing GPU cost.
- Replaced expensive physical materials with standard metallic materials while preserving the visual style.
- Reduced sphere/torus geometry segments and rounded-box subdivisions.
- Reduced ambient particles and final-scene instances.
- Reduced logo texture anisotropy.
- Pauses decorative CSS animations when off-screen.
- Reduced header/process blur cost on mobile.
- Preserved Start Project, email notifications, Cloudflare worker, project previews, and the new Boost Mind logo.
