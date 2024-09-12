# Sensory Misalignment
Snap x RCA project exploring senses on AR.
More information here in the [snap rca workshop repo](https://github.com/chanulee/snap-rca-camkit-workshop)
## 1. File Directory
- **sensory-misalign-publish: Final published work** (Lighter version)
- sensory-misalign: Final result of the Snap x RCA project
- combined-apple-prefab: Final 3D model of the apple: both combined and not
## 2. Software
- Applying delta movement
- Applying delta rotation
- Hand tracking
- Grab gesture
- Developed in Lens Studio 4.55
## 3. Starting from the Scratch
- For easier integration, the object should be labeled 'P(Prefab)' in the Snap Lens Studio.
- Find 'Hand Physics' from the asset library and add it under the camera
- Bit different part with Laura Chambers' project is that as the Hand Physics asset is updated, we don't really have to set up the hand tracking mode in 'attachment' and 'Proportions and Pose'. (But it's good to know the mechanics of it - refer to her tutorial)
- Select the Prefab object (in this case: combined-apple 2) and drag the script from resource panel to the Inspector (area on the right side of the screen) and choose itself for a 'model'. You can also edit the threshold here.
## 4. Changing the 3D Model (sensory-misalign)
- Download the project (s-m-p recommended)
- Import the P(Prefab) into resources, move to the stage
- Make sure everything is centred
- 'Add Component' -> 'Script' -> 'ManipulateManager' -> Choose 'Model' -> Grab threshold 5.00
## 4. References
1. Interacting with objects in AR using 3D Hand Tracking in Lens Studio [Youtube](https://www.youtube.com/watch?v=AgweoeLMFEk)
2. Snap x RCA camera kit workshop [Github Repo](https://github.com/chanulee/snap-rca-camkit-workshop)
3. Snap Lens Document (4.55) [docs.snap.com](https://docs.snap.com/lens-studio/4.55.1/home)
## 5. Notes
- Max project size 50MB to send & test on snapchat
- Max project size 8MB to publish it on app or web
---
**Snap x RCA**    
Advisor: Professor Jack Hardiker (Royal College of Art), Dr. Stacey Long-Genovese (Snap Inc.)

- Role: Research & Development
- Chun Gao (3D Models), Yuebin Zhang (3D Model + Research), Jake Buckley (Sound)
