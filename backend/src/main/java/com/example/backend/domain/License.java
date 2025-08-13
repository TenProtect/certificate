package com.example.backend.domain;

public class License {
    private Long id;
    private String name;
    private String badge;
    private String printSize;
    private String pixelSize;

    public License() {}

    public License(Long id, String name, String badge, String printSize, String pixelSize) {
        this.id = id;
        this.name = name;
        this.badge = badge;
        this.printSize = printSize;
        this.pixelSize = pixelSize;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public String getPrintSize() {
        return printSize;
    }

    public void setPrintSize(String printSize) {
        this.printSize = printSize;
    }

    public String getPixelSize() {
        return pixelSize;
    }

    public void setPixelSize(String pixelSize) {
        this.pixelSize = pixelSize;
    }
}
