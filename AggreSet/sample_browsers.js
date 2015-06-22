var theDirPath = '../demo/data/set_'; 
var upsetSourceURL = 'http://vcg.github.io/upset/';

var browser_configs = {
    lesMiserables: {
        title: "Les Miserables",
        sets: "80 characters",
        items: "356 chapters",
        attribs: "Book Volume",
        width: 700,
        credits: "<a href='http://www-cs-staff.stanford.edu/~uno/sgb.html' target='_blank'>"+
            "Stanford GraphBase</a> (C) 1993 Stanford University. Les Misérables by Victor Hugo.",
        browser: {
            barChartWidth: 90,
            leftPanelLabelWidth: 180,
            itemName: "Les Misérables Chapters",
            source: {
                gdocId: '1nMU5gL16rDXdDIDRs6bvTRMoUuhdd3vmeaVi2WVv0pE',
                sheets: [ {name:"Chapters"},{name:"Characters"} ]
            },
            loadedCb: function(){
                kshf.Util.cellToArray(kshf.dt.Chapters, ['Characters'], /,|;/g, false);
            },
            summaries: [
                {   title: "Characters",
                    sortingOpts:[
                        {name:"# of Occurances"},
        /*                {name:"Cluster", value: function(){ return kshf.dt_id.Characters[this.id].data[3];}} */
                    ],
                    catLabel: function(){ return kshf.dt_id.Characters[this.id].data.Name; }
                },{ title: "Volume", collapsed: true,
                    sortingOpts: [{value: "id"}],
                    catLabel: function(){ return "Volume "+this.id; }
                }
            ],
            itemDisplay: {
                sortColWidth: 45,
                detailsToggle: "off",
                recordView: function(){
                    var characters="";
                    var str="<i class='fa fa-book'></i>"+
                        " <span style='font-weight:300'>Vol.</span> "+this.Volume+
                        " <span style='font-weight:300'>Book</span> "+this.Book+
                        " <span style='font-weight:300'>Chap.</span> "+this.Chapter;
                    if(this.Characters && this.Characters.length>0){
                        this.Characters.forEach(function(c){
                            characters+=kshf.dt_id.Characters[c].data.Name+", ";
                        });
                        str+="<br><i class='fa fa-users'></i> "+characters;
                    }
                    return str;
                }
            }
        }
    },
    movies: {
        title: "Movies",
        sets: "17 genres",
        items: "3883 movies",
        attribs: "",
        width: 850,
        credits: "<a href='http://grouplens.org/datasets/movielens/' target='_blank'>MovieLens</a> "+
            "ratings dataset. Curated and filtered by <a href='http://www.cvast.tuwien.ac.at/~bilal' target='_blank'>Alsallakh</a>.",
        browser: {
            leftPanelLabelWidth: 140,
            rightPanelLabelWidth: 100,
            barChartWidth: 80,
            source:{ url:upsetSourceURL, dirPath:theDirPath, fileType:'csv', sheets:[{name:"movies"}] },
            summaries: [
                {   title: "Genres",
                    attribMap: function(){
                        var r=[];
                        for(var x in this){
                            if(x==="Name") continue;
                            if(x==="ReleaseDate") continue;
                            if(x==="AvgRating") continue;
                            if(x==="Watches") continue;
                            if(x==="id") continue;
                            if(this[x]==1) r.push(x);
                        }
                        return r;
                    },
                    enableSetVis: true
                },{ title: "Rating", attribMap: "AvgRating", layout: 'right'
                },{ title: "Watched", attribMap: "Watches", layout: 'right', intervalScale: 'log'
                },{ title: "Release Year", attribMap: function(){ return new Date(this.ReleaseDate,1,1); }, layout: 'bottom'
                }
            ],
            itemDisplay: {
                sortColWidth: 50,
                detailsToggle: 'off',
                sortingOpts: ['Rating', 'Watched'],
                recordView: function(){ return "<i class='fa fa-film'></i> "+this.Name; }
            }
        }
    },
    simpsons: {
        title: "Simpsons",
        sets: "6 features",
        items: "24 characters",
        attribs: "Age",
        source: "UpSet",
        width: 800,
        credits: "Author: <a href='http://alexander-lex.net/' target='_blank'>Alexander Lex</a>."+
            " A collection of simpsons characters and their attributes.",
        browser: {
            leftPanelLabelWidth: 110,
            itemName: "Characters in the Simpsons",
            source:{ url:upsetSourceURL, dirPath:theDirPath, fileType:'csv', sheets:[{name:"simpsons"}] },
            summaries: [
                {   title: "Features",
                    attribMap: function(){
                        var r=[];
                        if(this.School===1) r.push("Goes to school");
                        if(this['Blue Hair']===1) r.push("Has blue hair");
                        if(this['Duff Fan']===1) r.push("Duff fan");
                        if(this.Evim===1) r.push("Evin");
                        if(this.Male===1) r.push("Male");// else r.push("Female");
                        if(this['Power Plant']===1) r.push("Power Plant");
                        return r;
                    }
                },{ title: "Age"
                }
            ],
            itemDisplay: {
                sortColWidth: 45,
                sortingOpts: 'Age',
                displayType: 'grid',
                recordView: function(){ 
                    return "<img class='simpson_head' src='img/simpsons/"+this.Name+".jpeg'>"+
                        "<span class='simpson_name'>"+this.Name+"</span>";
                }
            }
        }
    },
    foodFlavorNetwork: {
        title: "Food Flavor Network",
        sets: "82 Ingredients",
        items: "5000 Recipes",
        attribs: "Region",
        credits: "Ahn, Yong-Yeol, et al. \"Flavor Network and the Principles of Food Pairing.\" "+
                "<a href='http://www.nature.com/srep/2011/111215/srep00196/full/srep00196.html' target='_blank'>Scientific reports</a> 1 (2011)",
        browser: {
            middlePanelLabelWidth: 150,
            source: {
                url: 'http://www.nature.com/srep/2011/111215/srep00196/full/srep00196.html',
                gdocId: '1u7Lc-TUhcqW_OqC4R-ovJe_Ji0nQ7Zdps_jvsaWo824',
                sheets: [ {name:"Recipes", range:"1:5001"} ]
            },
            loadedCb: function(){
                kshf.Util.cellToArray(kshf.dt.Recipes,['Ingredients'],"*",false);
            },
            summaries: [
                {   title: "Ingredients", minAggrValue: 100, layout: "middle"
                },{ title: "Region", layout: "middle"
                }
            ]
        }
    },
    hboShows: {
        title: "HBO Actors",
        sets: "24 Shows",
        items: "67 Actors",
        attribs: "",
        credits: "<a href='http://grantland.com/features/the-hbo-recycling-program/' target='_blank'>"+
            "The HBO Recycling Program</a>. Research: S. Schube, D. Savitzky / Also <a href='http://zgrossbart.github.io/hborecycling/' target='_blank'>visualized</a> by Zack Grossbart",
        browser: {
            barChartWidth: 90,
            leftPanelLabelWidth: 200,
            itemName: "Actors",
            source: {
                url: "http://grantland.com/features/the-hbo-recycling-program/",
                // http://zgrossbart.github.io/hborecycling/
                // https://github.com/zgrossbart/hborecycling
                callback: function(browser){
                    browser.primaryTableName = "Actors";
                    kshf.dt.Actors = [];
                    kshf.dt_id.Actors = {};

                    var HBO_data = {
                        "Aidan Gillen": [ "Game of Thrones", "The Wire" ],
                        "Alexander Skarsgård": [ "Generation Kill", "True Blood" ],
                        "Amy Ryan": [ "In Treatment", "The Wire" ],
                        "Annie Fitzgerald": [ "Big Love", "True Blood" ],
                        "Anwan Glover": [ "Treme", "The Wire" ],
                        "Blair Underwood": [ "John from Cincinnati", "Sex and the City" ],
                        "Brian F. O'Byrne": [ "Oz", "K Street" ],
                        "Chris Bauer": [ "True Blood", "The Wire" ],
                        "Clarke Peters": [ "Oz", "Treme", "True Blood", "The Wire" ],
                        "Cynthia Ettinger": [ "Carnivàle", "Curb Your Enthusiasm", "Deadwood" ],
                        "Cyrus Farmer": [ "The Corner", "Oz", "The Wire" ],
                        "Dane DeHaan": [ "In Treatment", "True Blood" ],
                        "Dania Remirez": [ "Entourage", "The Sopranos" ],
                        "David Costabile": [ "Flight of the Conchords", "The Wire" ],
                        "Dayton Callie": [ "Deadwood", "In Treatment" ],
                        "Dominic Chianese": [ "Boardwalk Empire", "The Sopranos" ],
                        "Domonic Lombardozzi": [ "Entourage", "Oz", "The Wire" ],
                        "Don Swayze": [ "Carnivàle", "True Blood" ],
                        "Edie Falco": [ "Oz", "The Sopranos" ],
                        "Edoardo Ballerini": [ "Boardwalk Empire", "The Sopranos" ],
                        "Edwina Findley": [ "True Blood", "The Wire" ],
                        "Garret Dillahunt": [ "Deadwood", "John from Cincinnati" ],
                        "Glynn Turman": [ "John from Cincinnati", "The Wire" ],
                        "Grant Show": [ "Big Love", "Six Feet Under" ],
                        "Greg Antonacci": [ "Boardwalk Empire", "The Sopranos" ],
                        "J. Smith-Cameron": [ "K Street", "True Blood" ],
                        "James Ransone": [ "Generation Kill", "Treme", "The Wire" ],
                        "Jamie-Lynn Sigler": [ "Entourage", "The Sopranos" ],
                        "Jim Beaver": [ "Deadwood", "John from Cincinnati", "Six Feet Under" ],
                        "Jim True-Frost": [ "True Blood", "The Wire" ],
                        "J.D. Williams": [ "The Wire", "Oz", "Sex and the City" ],
                        "John Carroll Lynch": [ "Big Love", "Carnivàle", "How To Make It in America" ],
                        "John Doman": [ "Oz", "The Sopranos", "The Wire" ],
                        "John Hawkes": [ "Eastbound and Down", "Deadwood" ],
                        "John Seda": [ "Oz", "Treme" ],
                        "Kevin Rankin": [ "Big Love", "Six Feet Under" ],
                        "Kim Dickens": [ "Deadwood", "Treme" ],
                        "Laila Robins": [ "In Treatment", "The Sopranos", "Sex and the City", "Bored to Death" ],
                        "Lance Reddick": [ "The Wire", "Oz", "The Corner" ],
                        "Louis Lombardi": [ "Entourage", "The Sopranos" ],
                        "Luis Guzmán": [ "How To Make It in America", "John from Cincinnati", "Oz" ],
                        "Luke Perry": [ "Oz", "John from Cincinnati" ],
                        "Mary Kay Place": [ "Big Love", "Bored to Death" ],
                        "Matt Winston": [ "John from Cincinnati", "Six Feet Under" ],
                        "Method Man": [ "Oz", "The Wire" ],
                        "Michael Kenneth William": [ "Boardwalk Empire", "The Sopranos", "The Wire" ],
                        "Michelle Forbes": [ "In Treatment", "True Blood" ],
                        "Paul Ben-Victor": [ "Entourage", "The Wire", "John from Cincinnati", "Curb Your Enthusiasm" ],
                        "Paul Herman": [ "Entourage", "The Sopranos" ],
                        "Paula Malcomson": [ "Deadwood", "John from Cincinnati", "Six Feet Under" ],
                        "Reg E. Cathey": [ "The Wire", "Oz", "The Corner" ],
                        "Robert Clohessy": [ "Boardwalk Empire", "Oz" ],
                        "Roxanne Hart": [ "Hung", "Oz" ],
                        "Seth Gilliam": [ "Oz", "The Wire" ],
                        "Stephen Toblowsky": [ "Deadwood", "Curb Your Enthusiasm", "John from Cincinnati" ],
                        "Steve Buscemi": [ "Boardwalk Empire", "The Sopranos" ],
                        "Steve Earle": [ "The Wire", "Six Feet Under", "Treme" ],
                        "Ted Danson": [ "Bored to Death", "Curb Your Enthusiasm" ],
                        "Tom Aldredge": [ "Boardwalk Empire", "The Sopranos" ],
                        "Tom Mardirosian": [ "Oz", "The Wire" ],
                        "Tom Townsend": [ "Entourage", "The Wire" ],
                        "Toni Lewis": [ "Oz", "The Wire" ],
                        "Vincent Piazza": [ "Boardwalk Empire", "The Sopranos" ],
                        "Wendel Pierce": [ "Treme", "The Wire" ],
                        "William Sanderson": [ "True Blood", "Deadwood" ],
                        "Willie Garson": [ "John from Cincinnati", "Sex and the City" ],
                        "Zeljko Ivanek": [ "Big Love", "True Blood", "Oz" ]
                    };

                    for(var actorName in HBO_data){
                        var kshfItem = new kshf.Item( {'Name':actorName, "HBO Shows":HBO_data[actorName]},'Name');
                        kshf.dt.Actors.push(kshfItem);
                    }

                    browser.items = kshf.dt.Actors;
                    browser.loadCharts(); 
                }
            },
            summaries: [{ title: "HBO Shows", layout: "left" }],
            itemDisplay: {
                sortColWidth: 65,
                sortingOpts: [{ title: '# of Shows', value: function(){ return this['HBO Shows'].length; } }],
                textSearch: "Name",
                recordView: function(d){
                    // resize d based on # of shows!
                    d.DOM.record.style.fontSize = (0.8+(d.data['HBO Shows'].length*0.1))+"em";
                    return d.data.Name;
                }
            }
        }
    },
    dataBreaches: {
        title: "Data Breaches",
        sets: "18 RecordTypes",
        items: "284 breaches",
        attribs: "Industry, Date...",
        width: 900,
        credits: "<a href='http://www.bloomberg.com/infographics/2014-08-21/top-data-breaches.html' target='blnk'>Bloomberg</a> "+
            "Data Breaches in the U.S.",
        browser: {
            itemName: "Data Breaches",
            leftPanelLabelWidth: 140,
            rightPanelLabelWidth: 150,
            barChartWidth: 70,
            source: {
                gdocId: '14vd0RHPy-JyetjppxJ4R5UywaeszV0HR599MX91KkjI',
                sheets: [ {name:"Breaches"} ]
            },
            loadedCb: function(){
                kshf.Util.cellToArray(kshf.dt.Breaches, ['Record Types'], ",", false);
            },
            summaries:[
                {   title: "Record Types", catLabel: getRecordTypeLabel
                },{ title: "Type", layout: 'right'
                },{ title: "Industry", layout: 'right'
                },{ title: "Source", layout: 'right'
                },{ title: "Date", layout: "bottom"
                }
            ],
            itemDisplay: {
                sortColWidth: 65,
                sortingOpts: "# of Records",
                recordView: "org"
            }
        }
    },
    tedTalks: {
        title: "TED Talks",
        sets: "9 Feelings",
        items: "1759 TED Talks",
        attribs: "#ofViews",
        source: "Keshif",
        credits: "<a href='https://www.ted.com/talks' target='_blank'>TED Talks</a>",
        browser: {
            barChartWidth: 90,
            leftPanelLabelWidth: 100,
            rightPanelLabelWidth: 90,
            itemName: "TED Talks",
            source: {
                gdocId: '1N5Pk58GmTYAPSC6biWL8K2auf40jYbAQRstKeEWO8yY',
                sheets: [ {name:"Talks"} ]
            },
            loadedCb: function(){
                kshf.Util.cellToArray(kshf.dt.Talks, ['Feelings'],"+",false);
                kshf.dt.Talks.forEach(function(d){
                    var views = d.data.Views;
                    if(views[views.length-1]==="M") {
                        views = 1000000*views.substr(0,views.length-1)
                    } else if(views[views.length-1]==="K") {
                        views = 1000*views.substr(0,views.length-1)
                    }
                    d.data.Views = views;
                })
            },
            summaries: [
                { title: "Feelings"
                },{ title: "Views", layout: "bottom"
                }
            ],
            itemDisplay: {
                sortColWidth: 80,
                sortingOpts: 'Views',
                recordView: function(){ return this.Speaker+" - <b>"+this.Title+"</b>"; },
            }
        }
    },
    acmPapers_terms: {
        title: "ACM Papers - Terms",
        sets: "135 Terms",
        items: "70k papers",
        attribs: "Year",
        source: "Radial Sets",
        width: "700",
        credits: "<a href='http://www.psantos.com.pt/files/trabalhos-academicos/2007-2008-tmei/' target='_blank'>"+
            "ACM Multi-label Dataset (2008 version)</a>, A. P. Santos, F. Rodrigues. Multi-label Hierarchical Text Classification using the ACM Taxonomy.",
        browser: {
            categoryTextWidth: 200,
            rightPanelLabelWidth: 100,
            itemName: "Papers",
            source: { 
                url: "http://www.psantos.com.pt/files/trabalhos-academicos/2007-2008-tmei/",
                dirPath: "https://ca480fa8cd553f048c65766cc0d0f07f93f6fe2f.googledrive.com/host/0By6LdDWgaqgNfmpDajZMdHMtU3FWTEkzZW9LTndWdFg0Qk9MNzd0ZW9mcjA4aUJlV0p1Zk0/acm_",
                fileType:'csv', 
                sheets: [{name:"papers"},{name:"keywords"},{name:"ccs98"}]
            },
            summaries: [
                {   title: "Terms", layout: "middle",
                    attribMap: function(){
                        if(this.terms===undefined) return;
                        if(this.terms==="") return;
                        var r=[];
                        this.terms.split("+").forEach(function(d){
                            var termInfo = kshf.dt_id.ccs98[d];
                            if(termInfo===undefined) return;
                            if(termInfo.data.level==2) return;
                            r.push(d);
                        });
                        return r;
                    },
                    catLabel: function(){ return kshf.dt_id.ccs98[this.id].data.label; },
                    minAggrValue: 200
                },{ title: "Year", layout: "bottom"
                }
            ]
        }
    },
    acmPapers_keywords: {
        title: "ACM Papers - Keywords",
        sets: "60 Keywords",
        items: "70k papers",
        attribs: "Year",
        source: "Radial Sets",
        width: 550,
        credits: "<a href='http://www.psantos.com.pt/files/trabalhos-academicos/2007-2008-tmei/' target='_blank'>"+
            "ACM Multi-label Dataset (2008 version)</a>, A. P. Santos, F. Rodrigues. Multi-label Hierarchical Text Classification using the ACM Taxonomy.",
        browser: {
            categoryTextWidth: 170,
            rightPanelLabelWidth: 100,
            itemName: "Papers",
            source: {
                url: "http://www.psantos.com.pt/files/trabalhos-academicos/2007-2008-tmei/",
                dirPath: "https://ca480fa8cd553f048c65766cc0d0f07f93f6fe2f.googledrive.com/host/0By6LdDWgaqgNfmpDajZMdHMtU3FWTEkzZW9LTndWdFg0Qk9MNzd0ZW9mcjA4aUJlV0p1Zk0/acm_",
                fileType:'csv', 
                sheets:[{name:"papers"},{name:"keywords"},{name:"ccs98"}]
            },
            summaries: [
                {   title: "Keywords", layout: "middle",
                    attribMap: function(){
                        if(this.keywords===undefined) return;
                        if(this.keywords==="") return;
                        var r=[];
                        this.keywords.split("+").forEach(function(keyword){
                            if(kshf.dt_id.keywords[keyword]!==undefined) r.push(keyword);
                        });
                        return r;
                    },
                    catLabel: function(){ 
                        //return kshf.Util.toProperCase(kshf.dt_id.keywords[this.id].data.label);
                        return kshf.dt_id.keywords[this.id].data.label;
                    },
                    minAggrValue: 80
                },{ title: "Year", layout: "middle"
                }
            ],
        }
    },
    sharks: {
        title: "Shark Blood Tests",
        sets: "53 samples",
        items: "1817 compounds",
        attribs: "",
        credits: "<a href='http://www.cc.gatech.edu/gvu/ii/setvis/' target='_blank'>OnSet</a>"+
            ": Visualizing Boolean Set-Typed Data using Direct Manipulation. R. Sadana, T. Major, A. Dove, J. Stasko",
        browser: {
            leftPanelLabelWidth: 140,
            itemName: "Compounds",
            source:{ 
                callback: function(browser){
                    browser.primaryTableName = "Compounds";

                    kshf.dt.Compounds = [];
                    kshf.dt_id.Compounds = {};

                    $.ajax( {
                        url: theDirPath+"whaleshark_onset.csv",
                        async: false,
                        success: function(fileContent){
                            var samples = Papa.parse(fileContent, {header:false});
                            samples.data.forEach(function(row,rowNo){
                                var sampleName = row[0];
                                for(var i=1; i<row.length; i++){
                                    var chemName = row[i];
                                    if(chemName==="") continue;
                                    var theChem = kshf.dt_id.Compounds[chemName];
                                    if(theChem===undefined){
                                        theChem = new kshf.Item([[],chemName],1);
                                        kshf.dt_id.Compounds[chemName] = theChem;
                                        kshf.dt.Compounds.push(theChem);
                                    }
                                    theChem.data[0].push(sampleName);
                                }
                            });
                            browser.items = kshf.dt.Compounds;
                            browser.loadCharts();
                        }
                    });
                }
            },
            summaries:[
                {   title: "Samples",
                    attribMap: function(){ return this[0]; },
                    sortingOpts: [
                        {   name: "# of Compounds"},
                        {   name: "Name",  
                            func: function(a,b){
                                a = a.data[1].split(' ');
                                b = b.data[1].split(' ');
                                var shark_a = a[0];
                                var shark_b = b[0];
                                var name_comp = shark_a.localeCompare(shark_b);
                                if(name_comp!==0) return name_comp;
                                return parseInt(a[1]) - parseInt(b[1]);
                            }
                        }
                    ]
                },{ title: "Sharks",
                    description: "The compount appears with the shark if any sample taken from that shark includes that compound",
                    attribMap: function(){
                        var r=[];
                        this[0].forEach(function(sample){
                            r.push(sample.split(' ')[0]);
                        });
                        return r;
                    }
                }
            ],
            itemDisplay: {
                sortColWidth: 65,
                sortingOpts: [ {title: '#samples', value:function(){ return this[0].length; }} ],
                displayType: 'grid',
                maxVisibleItems_Default: 2000,
                recordView: function(d){
                    d.DOM.record.setAttribute("title",d.data[1]);
                }
            }
        }
    },
    socialgraph: {
        title: "Social Graph",
        sets: "7 Social Networks",
        items: "618 People",
        attribs: "",
        source: "UpSet",
        credits: "Author: <a href='http://www.michelecoscia.com/' target='_blank'>Michele Coscia</a>. "+
            "Social graph data for co-usage of multiple online social platforms.",
        browser: {
            middlePanelLabelWidth: 110,
            itemName: "People",
            source:{ url:upsetSourceURL, dirPath:theDirPath, fileType:'csv', sheets:[{name:"socialgraph", id:"Name"}] },
            summaries:[
                {   title: "Sets", layout: "middle",
                    attribMap: function(){
                        var r=[];
                        if(this['Facebook']===1) r.push('Facebook');
                        if(this['Flickr']===1) r.push('Flickr');
                        if(this['GMail']===1) r.push('GMail');
                        if(this['Google+']===1) r.push('Google+');
                        if(this['LastFM']===1) r.push('LastFM');
                        if(this['LinkedIN']===1) r.push('LinkedIN');
                        if(this['Twitter']===1) r.push('Twitter');
                        this.r = r;
                        return r;
                    }
                }
            ]
        }
    },
    faculty_country: {
        title: "CS Faculty x Countries",
        sets: "76 countries",
        items: "2100 faculty",
        attribs: "",
        source: "Keshif",
        width: 650,
        credits: "<a href='http://cs.brown.edu/people/alexpap/faculty_dataset.html' target='_blank'>Data</a> made available by <b>A. Papoutsaki et. al</b>, Brown University, Providence, RI, USA.",
        browser: {
            barChartWidth: 90,
            itemName: "CS Faculty",
            leftPanelLabelWidth: 120,
            source: {
                url: "http://cs.brown.edu/people/alexpap/faculty_dataset.html",
                dirPath: theDirPath,
                fileType: 'csv',
                sheets: [ {name: "cs_faculty"} ]
            },
            summaries: [
                {   title: "<i class='fa fa-globe'></i> Former Countries",
                    description: "For each CS faculty, lists the countries that s/he received her degrees from",
                    attribMap: function(){
                        var r=[];
                        a = this.Bachelors.split(" - ");
                        r.push(a[a.length-1].trim());
                        a = this.Masters.split(" - ");
                        r.push(a[a.length-1].trim());
                        a = this.Doctorate.split(" - ");
                        r.push(a[a.length-1].trim());
                        a = this.PostDoc.split(" - ");
                        r.push(a[a.length-1].trim());
                        return r;
                    }
                }
            ],
            itemDisplay: {
                sortColWidth: 60,
                sortingOpts: [ {title: 'Joined', value: function(){return this.JoinYear;}} ],
                recordView: "Name"
            }
        }
    },
    faculty_univ: {
        title: "CS Faculty x Universities",
        sets: "637 Universities",
        items: "2100 Faculty",
        attribs: "",
        source: "Keshif",
        width: 680,
        credits: "<a href='http://cs.brown.edu/people/alexpap/faculty_dataset.html' target='_blank'>Data</a> made available by <b>A. Papoutsaki et. al</b>, Brown University, Providence, RI, USA.",
        browser: {
            itemName: "CS Faculty",
            leftPanelLabelWidth: 250,
            source: {
                url: "http://cs.brown.edu/people/alexpap/faculty_dataset.html",
                dirPath: theDirPath,
                fileType: 'csv',
                sheets: [ {name: "cs_faculty"} ]
            },
            summaries: [
                {   title: "<i class='fa fa-globe'></i> Universities Attanded",
                    description: "For each CS faculty, lists the countries that s/he received her degrees from",
                    attribMap: function(){
                        var r=[];
                        if(this.Bachelors) r.push(this.Bachelors);
                        if(this.Masters) r.push(this.Masters);
                        if(this.Doctorate) r.push(this.Doctorate);
                        if(this.PostDoc) r.push(this.PostDoc);
                        return r;
                    }
                }
            ],
            itemDisplay: {
                sortColWidth: 60,
                sortingOpts: [ {title: 'Joined', value: function(){return this.JoinYear;}} ],
                recordView: "Name"
            }
        }
    },
    factbook_borders: {
        title: "Neighbor Countries",
        sets: ", As items & sets",
        items: "191 Countries",
        attribs: "",
        credits: "FactBook is released by the C.I.A. Data is made available in XML by Michael Schierl. "+
            "<a href='http://jmatchparser.sourceforge.net/factbook/' target='_blank'>Source</a>",
        width: 650,
        browser: {
            categoryTextWidth: 150,
            itemName: "Countries",
            source: { 
                url: "http://jmatchparser.sourceforge.net/",
                callback: function(browser){
                    factBrowser = browser;
                    $.ajax( {
                        url: 'https://ca480fa8cd553f048c65766cc0d0f07f93f6fe2f.googledrive.com/host/0By6LdDWgaqgNfmpDajZMdHMtU3FWTEkzZW9LTndWdFg0Qk9MNzd0ZW9mcjA4aUJlV0p1Zk0/factbook.xml',
                        type:"GET",
                        dataType:"xml",
                        async: true,
                        success: function(facts){ return loadFactbook(facts, browser); }
                    });
                }},
            summaries: [
                {   title: "Border countries"
                },{ title: "RegionID", layout: "left", collapsed: true
                }
            ],
            itemDisplay: {
                sortColWidth: 40,
                sortingOpts: 'Education Expenditures',
                recordView: "Name"
            }
        }
    },
    senate: {
        title: "Senate Votings",
        items: "100 Senators",
        sets: "110 votings",
        attribs: "Party",
        credits: "<a href='http://www.cc.gatech.edu/gvu/ii/setvis/' target='_blank'>OnSet</a>"+
            ": Visualizing Boolean Set-Typed Data using Direct Manipulation. R. Sadana, T. Major, A. Dove, J. Stasko",
        browser: {
            leftPanelLabelWidth: 190,
            itemName: "Senators",
            source: {
                url: "http://www.cc.gatech.edu/gvu/ii/setvis/onset/",
                callback:function(browser){
                    browser.primaryTableName = "Senators";

                    kshf.dt.Senators = [];
                    var arr = kshf.dt.Senators;

                    $.ajax({
                        //url: "http://apps.washingtonpost.com/investigative/homicides/api/v1/victim/?limit=0&offset=0&format=json",
                        // url: "./data_private/dc_homicides.json", // original source
                        url: "../demo/data/set_senate_onset.csv",
                        error: function(e,f){
                            console.log(e+" - "+f);
                        },
                        success: function(data){
                            data.split("\n").forEach(function(line, i){
                                var s=line.split(",");
                                var d={Name:s[0], Votes:[], id:i};
                                for(var k=1; k<s.length; k++){
                                    s[k] = s[k].trim();
                                    if(s[k]==="") continue;
                                    d.Votes.push(s[k]);
                                }
                                var item = new kshf.Item(d,"id");
                                arr.push(item);
                            });
                            browser.items = arr;
                            browser.loadCharts();
                        }
                    });
                }
            },
            summaries: [
                {   title: "Votes",
                },{ title: "Party",
                    attribMap: function(){
                        switch(this.Name.split(" ")[1].substr(1,1)){
                            case "D": return "Democrat";
                            case "R": return "Republican"
                        }
                    }
                }
            ],
            itemDisplay: {
                sortColWidth: 65,
                sortingOpts: [ {title: '# Votes', value:function(){ return this.Votes.length; }} ],
                recordView: "Name"
            }
        }
    },
    mutations: {
        title: "Mutations in Glioblastoma",
        sets: "100 genes",
        items: "284 mutations",
        attribs: "",
        width: 550,
        credits: "<a href='http://dx.doi.org/10.7908/C1HD7SP0' target='_blank'>TCGA Consortium</a> "+
            "Glioblastoma Multiforme Mutation Analysis, filtered for 100 most mutated genes.",
        browser: {
            leftPanelLabelWidth: 110,
            itemName: "Mutations",
            source:{ url:upsetSourceURL, dirPath:theDirPath, fileType:'csv', sheets:[{name:"gbm_mutated_top100"}] },
            summaries: [
                {   title: "Genes",
                    attribMap: function(d){
                        var r=[];
                        for(x in this){
                            if(x==="Identifier") continue;
                            if(x==="set_degree") continue;
                            if(x==="id") continue;
                            if(this[x]==1) r.push(x);
                        }
                        return r;
                    }
                }
            ],
            itemDisplay: {
                sortColWidth: 45,
                recordView: "Identifier"
            }
        }
    },
    CpdsVsProteinFam: {
        title: "Compound - Protein Interaction",
        sets: "10 sets",
        items: "1500 items",
        attribs: "",
        credits: "<a href='http://dx.doi.org/10.1073/pnas.1012741107' target='_blank'>Gleeson et al.<a> Protein binding of small molecules.",
        width: 550,
        browser: {
            middlePanelLabelWidth: 200,
            itemName: "cpds vs protein fam",
            source:{ 
                url:upsetSourceURL, 
                dirPath: "https://ca480fa8cd553f048c65766cc0d0f07f93f6fe2f.googledrive.com/host/0By6LdDWgaqgNfmpDajZMdHMtU3FWTEkzZW9LTndWdFg0Qk9MNzd0ZW9mcjA4aUJlV0p1Zk0/set_",
                fileType:'txt', 
                sheets:[{name:"CpdsVsProteinFam", id:'cpd'}]
            },
            summaries: [
                {   title: "Sets", layout: "middle",
                    attribMap: function(){
                        var r=[];
                        if(this['']===1) r.push('');
                        if(this['Endogenous Protease Inhibitor']===1) r.push('Endogenous Protease Inhibitor');
                        if(this['Nuclear Hormone Receptor']===1) r.push('Nuclear Hormone Receptor');
                        if(this['Other']===1) r.push('Other');
                        if(this['Other Hydrolase']===1) r.push('Other Hydrolase');
                        if(this['Other Ligase']===1) r.push('Other Ligase');
                        if(this['Other Signal Transducer']===1) r.push('Other Signal Transducer');
                        if(this['Other Transcription Regulator']===1) r.push('Other Transcription Regulator');
                        if(this['Other Transferase']===1) r.push('Other Transferase');
                        if(this['Transcription Factor']===1) r.push('Transcription Factor');
                        if(this['Ubiquitin Ligase']===1) r.push('Ubiquitin Ligase');
                        return r;
                    }
                }
            ]
        }
    },
    CpdsVsProteinTable: {
        title: "Compound - Protein Interaction",
        sets: "100 sets",
        items: "15k items",
        attribs: "",
        credits: "<a href='http://dx.doi.org/10.1073/pnas.1012741107' target='_blank'>Gleeson et al.<a> Protein binding of small molecules.",
        browser: {
            leftPanelLabelWidth: 110,
            itemName: "cpds vs protein table",
            source:{ 
                url:upsetSourceURL,
                dirPath: "https://ca480fa8cd553f048c65766cc0d0f07f93f6fe2f.googledrive.com/host/0By6LdDWgaqgNfmpDajZMdHMtU3FWTEkzZW9LTndWdFg0Qk9MNzd0ZW9mcjA4aUJlV0p1Zk0/set_",
                fileType:'txt',
                sheets:[{name:"CpdsVsProteinTable", id:''}]
            },
            summaries: [
                {   title: "Sets", layout: "middle",
                    attribMap: function(){
                        var r=[];
                        for(x in this){
                            if(x==="ALogP") continue;
                            if(x==="CPD_SMILES") continue;
                            if(x==="set_degree") continue;
                            if(this[x]==1) r.push(x);
                        }
                        return r;
                    }
                }
            ]
        }
    },
    bederson: {
        title: "Ben Bederson's Coauthors",
        sets: "169 Co-Authors",
        items: "146 Papers",
        attribs: "",
        browser: {
            categoryTextWidth:135,
            barChartWidth: 100,
            source: {
                gdocId: '0Ai6LdDWgaqgNdEp1aHBzSTg0T0RJVURqWVNGOGNkNXc',
                sheets: [ {name: "Publications"}, {name: "Authors"}, {name: "AuthorTypes"} ]
            },
            loadedCb: function(){
                kshf.Util.cellToArray(kshf.dt.Publications, ['Coauthors']);
            },
            summaries: [
                {   title: "Coauthors",
                    attribMap: function(){
                        var BEDERSON_ID = 3;
                        var authors = this.Coauthors;
                        // remove Ben Bederson's ID
                        newAuthors = [];
                        for(i=0 ; i<authors.length ; i++){
                            if(authors[i]!==BEDERSON_ID) newAuthors.push(authors[i]);
                        }
                        return newAuthors;
                    },
                    catTableName: "Authors",
                    catLabel: function(){ return this.first_names[0]+". "+this.last_name; },
                    catTooltip: function(){ return this.first_names+" "+this.last_name; },
                }
            ],
            itemDisplay: {
                sortColWidth: 45,
                sortingOpts: {title: 'Year', value: "Date", label: function(){ return this.Date.getFullYear();}, inverse:true },
                textSearch: 'title',
                detailsToggle: "One",
                recordView: "title"
            }
        }
    },
    teaser: {
        title: "Paper Teaser",
        sets: "XX",
        items: "XX",
        attribs: "XX",
        width: 800,
        browser: {
            leftPanelLabelWidth: 100,
            rightPanelLabelWidth: 100,
            barChartWidth: 80,
            source:{ url:upsetSourceURL, dirPath:theDirPath, fileType:'csv', sheets:[{name:"movies"}] },
            summaries: [
                {   title: "Genres",
                    attribMap: function(){
                        var r=[];
                        for(var x in this){
                            if(x==="Name") continue;
                            if(x==="ReleaseDate") continue;
                            if(x==="AvgRating") continue;
                            if(x==="Watches") continue;
                            if(x==="id") continue;
                            if(this[x]==1) r.push(x);
                        }
                        return r;
                    },
                    enableSetVis: true
                },{ title: "Rating", attribMap: "AvgRating", layout: 'right'
                },{ title: "Watched", attribMap: "Watches", layout: 'right', intervalScale: 'log', collapsed: true
                //},{ title: "Release Year", attribMap: function(){ return new Date(this.ReleaseDate,1,1); }, layout: 'bottom'
                }
            ],
            itemDisplay: {
                sortColWidth: 50,
                detailsToggle: 'off',
                sortingOpts: ['Rating', 'Watched'],
                recordView: function(){ return "<i class='fa fa-film'></i> "+this.Name; }
            }
        }
    },

};

var breachTypeInfo = {
    'NAM': 'Name',
    'PII': 'Personally Iden. Info.',
    'SSN': 'Social Sec. No.',
    'DOB': 'Birthdate',
    'ADD': 'Address',
    'EMA': 'Email',
    'CCN': 'Credit Card No',
    'PSS': 'Password',
    'LOG': 'Log',
    'MED': 'Medical Records',
    'FIN': 'Financial',
    'VIRUS': 'Virus',
    'PHO': 'Phone',
    '1 MILLAN DOLLAR': "1M $"
};
var getRecordTypeLabel = function(d){
    if(breachTypeInfo[this.id]) return breachTypeInfo[this.id];
    return this.id;
};

function loadFactbook(facts, factBrowser){
    var tableName = "Countries";
    factBrowser.primaryTableName = tableName;
    kshf.dt[tableName] = [];
    kshf.dt.Category = [];
    var arr = kshf.dt[tableName];
    var arr_cat = kshf.dt.Category;
    arr_cat_id = {};

    var notCountries = {
        'xx': 'World',
        'ee': 'European Union',
        'ay': 'Antarctica',
        'oo': 'Southern Ocean',
        'xo': 'Indian Ocean',
        'xq': 'Arctic Ocean',
        'zh': 'Atlantic Ocean',
        'zn': 'Pacific Ocean'
    };

    function cleanUpText(n){
        n = n.replace(/( \d*\.*\d*\%)/g, ''); // Remove LANG 2.232% - percentage
        n = n.replace(/ \(.*\)/g, ''); // Remove things inside paranthesis
        n = n.replace(/\(|\)/g, ''); // remove any remainign paranthesis characters
        if(n.length>20) return null; // Probably an improper string
        return kshf.Util.toProperCase(n);
    };


    $(facts).find("> factbook > category").each(function(){
        var catName = this.getAttribute("name");
        $(this).find("> field").each(function(){
            var catData = {};
            catData.Name = this.getAttribute("name");
            catData.id = this.getAttribute("id");
            catData.Unit = this.getAttribute("unit");
            catData['Rank Order'] = this.getAttribute("rankorder");
            catData.Description = $(this).find("description").text();
            // TODO: some categories include fields, and store info per each country! like population, etc

            var item = new kshf.Item(catData,"id");
            arr_cat.push(item);
            arr_cat_id[catData.id] = item;
        });
    });

    $(facts).find('> factbook > region').each(function(){
        var region = this;
        var regionName = region.getAttribute("name");
        var regionID = region.getAttribute("id");
        $(this).find("> country").each(function(d,i){
            // if(d>10) return;
            var country = this;
            var cData = {};
            cData.id = this.getAttribute("id"); // ag, tr, us, ...
            if(notCountries[cData.id]!==undefined) return; // Not a country
            cData.Name = this.getAttribute("name");
            cData.Region = regionName;
            cData.RegionID = regionID;
            cData.Flag = this.getAttribute("flag"); // if "1", country has a flag in the database
            $(this).find("> field").each(function(){
                var field = this;
                var ref = this.getAttribute("ref");
                info = arr_cat_id[ref].data;
                var columnName = info.Name;
                switch(ref){
                    case 'f2111': // Natural resources
                        cData[columnName] = [];
                        this.textContent.split(", ").forEach(function(n){
                            cData[columnName].push(kshf.Util.toProperCase(n));
                        });
                        break;
                    case 'f2098': // Languages
                        cData[columnName] = [];
                        this.textContent.split(", ").forEach(function(n){
                            var lang = cleanUpText(n);
                            if(lang===null) return;
                            lang = lang.replace(" (official)","");
                            lang = lang.replace(" (official","");
                            // if there's a number component at the end, remove it
                            cData[columnName].push(lang);
                        });
                        break;
                    case 'f2122': // Religions
                        cData[columnName] = [];
                        this.textContent.split(", ").forEach(function(n){
                            var rlgn = cleanUpText(n);
                            cData[columnName].push(rlgn);
                        });
                        break;
                    case 'f2096':
                        cData["Border countries"] = [];
                        var dataIndex=-1;
                        for(var i=0; i<this.childNodes.length; i++) {
                            var node = this.childNodes[i];
                            if(i===dataIndex){
                                countriesStr = node.textContent;
                                if(countriesStr==="") return;
                                countriesStr.split(", ").forEach(function(n){
                                    var x=n.replace(/ (\d|,|\.)* km/g,'');
                                    x=x.replace("-Naxcivan exclave","");
                                    x=x.replace("-proper","");
                                    x=x.replace(/\s*\(.*\)/g,'')
                                    cData["Border countries"].push(x);
                                });
                            }
                            if(node.tagName!==undefined){
                                if(node.getAttribute("name")==="border countries:") {
                                    dataIndex = i+1;
                                }
                            }
                        };
                        break;
                    case 'f2109': // Independence
                        cData["Independence"] = this.textContent;
                        break;
                    case 'f2057': // Capital
                        cData.Capital = this.childNodes[1].textContent;
                        break;
                    case 'f2177': // Median age
                        if(this.childNodes!==undefined && this.childNodes[1]!==undefined){
                            // remove years, turn it into string
                            var age = this.childNodes[1].textContent.replace(" years","");
                            age = parseFloat(age);
                            if(age!==NaN) cData['Median Age'] = age;
                        }
                        break;
                    case 'f2119': // Population
                        // remove (estimate...) and comma's
                        var n = this.textContent.replace(/,|\.|(\(.*\))/g,'');
                        n = parseInt(n);
                        if(isNaN(n)) break;
                        cData.Population = n;
                        break;
                    case 'f2206': //  EDUCATION EXPENDITURES
                        var n = this.textContent.replace(/\% of GDP (\(.*\))/g,'');
                        n = parseFloat(n);
                        if(isNaN(n)) break;
                        cData["Education Expenditures"] = n;
                        break;
                    default:
                        break;

                }
//                var fieldInfo = categories.find(">field[id='"+ref+"']");
//                var fieldName = 232;
            });

            arr.push(new kshf.Item(cData,"id"));
        });
    });

    factBrowser.items = kshf.dt[factBrowser.primaryTableName];
    factBrowser.loadCharts();   
};

var study_borders = {
    categoryTextWidth: 150,
    rightPanelLabelWidth: 90,
    barChartWidth: 90,
    itemName: "Countries",
    source: { 
        url: "http://jmatchparser.sourceforge.net/",
        callback: function(browser){
            factBrowser = browser;
            $.ajax( {
                url:"./data/factbook.xml",
                type:"GET",
                dataType:"xml",
                async: true,
                success: function(facts){ return loadFactbook(facts, browser); }
            });
        }},
    summaries: [
        {
            title: "Border countries"
        },{
            title: "RegionID", layout: "right"
        },{
            title: "Education Expend.s (%)", layout: "right", unitName: "%",
            description: "This entry provides the public expenditure on education as a percent of GDP.",
            attribMap: function(d){ return d.data["Education Expenditures"]; }
        },{
            title: "Natural resources", layout: "right",
            description: "This entry lists a country's mineral, petroleum, hydropower, and other resources of commercial importance, such as rare earth elements (REEs). In general, products appear only if they make a significant contribution to the economy, or are likely to do so in the future."
        }
    ],
    itemDisplay: {
        sortColWidth: 52,
        sortingOpts: [
            { title: 'Population',
                label: function(d){
                    var p=d.data.Population;
                    if(p===undefined) return "-";
                    return d3.format(".4s")(p);
                }
            }
        ],
        recordView: function(d){
            var str="";
            // Country locator
            str +="<img class='locator' src='https://www.cia.gov/library/publications/the-world-factbook/graphics/locator/"
                +d.data.RegionID+"/"+d.data.id+"_large_locator.gif'/>"; 
            // Country name
            str += "<div class='name'>"+d.data.Name;
            return str;
        },
    }
};


