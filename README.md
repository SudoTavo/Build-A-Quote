# Build-A-Quote
Product builder and quote generation platform with database management, PDF generation, and automated email functionality.

[See a live example here](http://museinthewires.com/buildaquote/).

### Features
With this adaptable web application, users can build a customized product order with real time cost calculation. The app can generate an itemized quote from the order in PDF format, and even email the quote to a specificed email address. Users can choose to append multiple products to the same quote and recieve an overview of there entire order.

The products and option content is managed from a MySQL database. Admins can specific a custom product name, image, option-categories, options, and costs. Includes the ability to enfore required options on products and costs based on hardware percentages.

When a user request a quote in the form of a PDF or email, the order information is automatically documented to seperate SQL table .

## Installation
Build-A-Quote requires a LAMP (Linux, Apache, MySQL, PHP) stack to run. These instructions are intended for Debian Linux, but should be compatible with other platforms as well. You can find a tutorial for installing a LAMP stack [here](https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-on-debian).

For PDF generation, you will need [wkhtmltopdf](http://wkhtmltopdf.org/) and [xvfb](https://www.x.org/archive/X11R7.6/doc/man/man1/Xvfb.1.xhtml).

Install wkhtmltopdf with:
```sh
$ sudo apt-get install wkhtmltopdf
```

and xvfb with:
```sh
$ sudo apt-get install xvfb
```

For email functionality, you will also need Python installed. This should be installed by default on most Debian distros.

If you would like a GUI to manage your MySQL databases, it is also recommend that you install [phpMyAdmin](https://www.phpmyadmin.net/). See installation instructions [here](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-phpmyadmin-on-debian-7).

