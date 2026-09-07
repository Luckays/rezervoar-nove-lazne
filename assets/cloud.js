(() => {
  const status = document.getElementById('cloud-status');
  const fitButton = document.getElementById('fit-cloud');
  const sidebarButton = document.getElementById('toggle-sidebar');
  const sizeSlider = document.getElementById('point-size');
  const fullscreenButton = document.getElementById('cloud-fullscreen');
  const shell = document.getElementById('cloud-shell');
  let pointcloud = null;

  const viewer = new Potree.Viewer(document.getElementById('potree_render_area'));
  window.viewer = viewer;
  viewer.setEDLEnabled(true);
  viewer.setEDLRadius(1.4);
  viewer.setEDLStrength(1.1);
  viewer.setFOV(58);
  viewer.setPointBudget(2_000_000);
  viewer.setMinNodeSize(0);
  viewer.setBackground('gradient');
  viewer.loadSettingsFromURL();

  viewer.loadGUI(() => {
    viewer.setLanguage('en');
    sidebarButton.disabled = false;
  });

  Potree.loadPointCloud('pointclouds/rezervoar/metadata.json', 'Rezervoár minerální vody', (event) => {
    pointcloud = event.pointcloud;
    viewer.scene.addPointCloud(pointcloud);

    const material = pointcloud.material;
    material.size = Number(sizeSlider.value);
    material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
    material.shape = Potree.PointShape.CIRCLE;
    material.activeAttributeName = 'rgba';

    const fitLoadedCloud = () => {
      const renderArea = document.getElementById('potree_render_area');
      viewer.renderer.setSize(renderArea.clientWidth, renderArea.clientHeight);
      viewer.fitToScreen(0.85);
    };
    requestAnimationFrame(fitLoadedCloud);
    window.setTimeout(fitLoadedCloud, 500);
    status.textContent = '1 591 209 barevných bodů · interaktivní zobrazení';
  });

  fitButton.addEventListener('click', () => viewer.fitToScreen(0.85));
  sidebarButton.addEventListener('click', () => {
    shell.classList.toggle('sidebar-open');
    viewer.toggleSidebar();
  });
  sizeSlider.addEventListener('input', () => {
    if (pointcloud) pointcloud.material.size = Number(sizeSlider.value);
  });

  fullscreenButton.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await shell.requestFullscreen();
    } catch (error) {
      console.warn('Fullscreen není v tomto prohlížeči dostupný.', error);
    }
  });
  document.addEventListener('fullscreenchange', () => {
    fullscreenButton.textContent = document.fullscreenElement ? '×' : '⛶';
  });
})();
